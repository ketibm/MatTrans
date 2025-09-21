import React, { useState, useEffect, useMemo } from "react";
import styles from "./AdminReservationsPanel.module.css";
import BookingForm from "../../components/Home/BookingForm";
import ModalCard from "../../components/Modal/ModalCard";
import ConfirmReservationModal from "../../components/Modal/ConfirmReservationModal";

const AdminReservationsPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reservationToConfirm, setReservationToConfirm] = useState(null);

  const [selectedDateBerovo, setSelectedDateBerovo] = useState(
    getTodayDateString()
  );
  const [selectedDateSkopje, setSelectedDateSkopje] = useState(
    getTodayDateString()
  );

  const [pendingPage, setPendingPage] = useState(1);
  const [berovoPage, setBerovoPage] = useState(1);
  const [skopjePage, setSkopjePage] = useState(1);

  const pendingPerPage = 50;
  const confirmedPerPage = 25;

  useEffect(() => {
    fetchReservations();
  }, []);

  function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  async function deleteExpiredPendingReservations(reservations) {
    const today = new Date().setHours(0, 0, 0, 0);
    const expired = reservations.filter((r) => {
      const resDate = new Date(r.date).setHours(0, 0, 0, 0);
      return r.status === "pending" && resDate < today;
    });

    for (const res of expired) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/reservations/${res._id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          console.warn(`Не можеше да се избрише резервацијата ${res._id}`);
        }
      } catch (error) {
        console.error("Грешка при бришење на застарена резервација:", error);
      }
    }
  }

  async function fetchReservations() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reservations");
      const data = await res.json();
      const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setReservations(sorted);

      await deleteExpiredPendingReservations(sorted);
      const refreshed = await fetch(
        "http://localhost:5000/api/reservations"
      ).then((r) => r.json());
      setReservations(
        refreshed.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Грешка при менување на статусот.");

      if (status === "rejected") {
        setReservations((prev) => prev.filter((r) => r._id !== id));
        setModalMessage(
          "Резервацијата е одбиена. Патникот е известен по е-маил."
        );
      } else {
        await fetchReservations();
        setModalMessage(`Статусот е променет на "${status}".`);
      }

      setModalOpen(true);
    } catch (error) {
      setModalMessage("Грешка при ажурирање на резервацијата.");
      setModalOpen(true);
      console.error("updateStatus error:", error);
    }
  }

  async function updateStatusWithDirection({
    id,
    direction,
    returnDate,
    tripType,
    returnDateUnknown,
    groupId,
  }) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "confirmed",
            direction,
            returnDate,
            tripType,
            returnDateUnknown,
            groupId,
          }),
        }
      );

      if (!response.ok) throw new Error("Грешка при менување на насоката.");

      await fetchReservations();

      setModalMessage(
        "Резервацијата е успешно потврдена и патникот е известен по е-маил."
      );
      setModalOpen(true);
    } catch (error) {
      setModalMessage("Грешка при потврдување на резервацијата.");
      setModalOpen(true);
    } finally {
      setConfirmModalOpen(false);
      setReservationToConfirm(null);
    }
  }

  const onConfirmClick = (reservation) => {
    setReservationToConfirm(reservation);
    setConfirmModalOpen(true);
  };

  const onCloseMessageModal = () => {
    setModalOpen(false);
  };

  const filteredPending = useMemo(
    () => reservations.filter((r) => r.status === "pending"),
    [reservations]
  );
  const pendingPagesCount = Math.ceil(filteredPending.length / pendingPerPage);
  const pendingPageData = useMemo(() => {
    const start = (pendingPage - 1) * pendingPerPage;
    return filteredPending.slice(start, start + pendingPerPage);
  }, [filteredPending, pendingPage]);
  const filteredBerovoSkopje = useMemo(() => {
    return reservations.filter(
      (r) =>
        r.status === "confirmed" &&
        r.direction === "berovo-skopje" &&
        r.date.split("T")[0] === selectedDateBerovo
    );
  }, [reservations, selectedDateBerovo]);

  const berovoPagesCount = Math.ceil(
    filteredBerovoSkopje.length / confirmedPerPage
  );
  const berovoPageData = useMemo(() => {
    const start = (berovoPage - 1) * confirmedPerPage;
    return filteredBerovoSkopje.slice(start, start + confirmedPerPage);
  }, [filteredBerovoSkopje, berovoPage]);

  const filteredSkopjeBerovo = useMemo(() => {
    return reservations.filter(
      (r) =>
        r.status === "confirmed" &&
        r.direction === "skopje-berovo" &&
        r.date.split("T")[0] === selectedDateSkopje
    );
  }, [reservations, selectedDateSkopje]);

  const skopjePagesCount = Math.ceil(
    filteredSkopjeBerovo.length / confirmedPerPage
  );
  const skopjePageData = useMemo(() => {
    const start = (skopjePage - 1) * confirmedPerPage;
    return filteredSkopjeBerovo.slice(start, start + confirmedPerPage);
  }, [filteredSkopjeBerovo, skopjePage]);

  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Претходна
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Следна
      </button>
    </div>
  );

  const renderTable = (
    data,
    date,
    setDate,
    pageData,
    currentPage,
    pagesCount,
    onPageChange,
    tableId,
    title,
    hideDateAndPrint = false
  ) => {
    const showDateColumn = title === "Резервации во тек";

    const totalPeople = data.reduce(
      (sum, r) => sum + (parseInt(r.adults || 0) + parseInt(r.children || 0)),
      0
    );

    return (
      <div>
        <h3>{title}</h3>
        <div className={styles.datePrintWrapper}>
          {!hideDateAndPrint && (
            <>
              <input
                type="date"
                className={styles.dateInput}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  onPageChange(1);
                }}
              />
              <button onClick={() => handlePrint(tableId, title, date)}>
                Печати
              </button>
            </>
          )}
        </div>
        <div className={styles.tableWrapper}>
          <table id={tableId} className={styles.table}>
            <thead>
              <tr>
                <th rowSpan="2">Име</th>
                <th rowSpan="2">Телефон</th>
                <th rowSpan="2" className="email">
                  Е-маил
                </th>
                <th rowSpan="2">Од</th>
                <th rowSpan="2">До</th>
                {showDateColumn && (
                  <>
                    <th rowSpan="2">Поаѓање</th>
                    <th rowSpan="2">Враќање</th>
                  </>
                )}
                <th colSpan="2">Патници</th>
                <th rowSpan="2"></th>
              </tr>
              <tr>
                <th>Возрасни</th>
                <th>Деца</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={showDateColumn ? "10" : "8"}>
                    Нема резервации.
                  </td>
                </tr>
              ) : (
                pageData.map((r) => (
                  <tr key={r._id}>
                    <td>{r.fullName}</td>
                    <td>{r.phone}</td>
                    <td className="email">{r.email}</td>
                    <td>{r.from}</td>
                    <td>{r.to}</td>

                    {showDateColumn && (
                      <>
                        <td>{new Date(r.date).toLocaleDateString()}</td>
                        <td>
                          {r.returnDate === null && r.returnDateUnknown
                            ? "Неопределено"
                            : r.returnDate
                            ? new Date(r.returnDate).toLocaleDateString()
                            : "-"}
                        </td>
                      </>
                    )}
                    <td>{r.adults}</td>
                    <td>{r.children}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        {title === "Резервации во тек" ? (
                          <>
                            <button
                              className={styles.confirmBtn}
                              onClick={() => onConfirmClick(r)}
                            >
                              Потврди
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={() => updateStatus(r._id, "rejected")}
                            >
                              Одбиј
                            </button>
                          </>
                        ) : (
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleDelete(r._id)}
                          >
                            Избриши
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {title !== "Резервации во тек" && (
              <tfoot>
                <tr>
                  <td
                    colSpan={showDateColumn ? "7" : "5"}
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Вкупно патници:
                  </td>
                  <td>
                    {data.reduce((sum, r) => sum + parseInt(r.adults || 0), 0)}
                  </td>
                  <td>
                    {data.reduce(
                      (sum, r) => sum + parseInt(r.children || 0),
                      0
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {pagesCount > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagesCount}
            onPageChange={onPageChange}
          />
        )}
      </div>
    );
  };

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Дали сте сигурни дека сакате да ја избришете резервацијата?"
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Грешка при бришење на резервацијата.");
      setReservations((prev) => prev.filter((r) => r._id !== id));
      setModalMessage("Резервацијата е успешно избришана.");
      setModalOpen(true);
    } catch (error) {
      setModalMessage("Грешка при бришење на резервацијата.");
      setModalOpen(true);
    }
  }

  const addReservation = async (formData) => {
    try {
      const {
        fullName,
        phone,
        email,
        date,
        from,
        to,
        adults,
        children,
        tripType,
        returnDate,
        returnDateUnknown,
        direction,
      } = formData;

      const basePayload = {
        fullName,
        phone,
        email,
        adults,
        children,
        status: "confirmed",
      };

      const firstReservation = {
        ...basePayload,
        date,
        from,
        to,
        direction: direction || null,
        tripType,
        returnDate: tripType === "roundTrip" ? returnDate : null,
        returnDateUnknown,
      };

      const response1 = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(firstReservation),
      });

      if (!response1.ok)
        throw new Error("Грешка при додавање на првата насока.");

      const newReservation1 = await response1.json();

      setReservations((prev) =>
        [...prev, newReservation1]
          .filter(Boolean)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
      );

      if (
        tripType === "oneWay" ||
        (tripType === "roundTrip" && (returnDateUnknown || returnDate))
      ) {
        setReservationToConfirm(newReservation1);
        setConfirmModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage("Грешка при додавање на резервацијата.");
      setModalOpen(true);
    }
  };

  function handlePrint(tableId, title, date) {
    const tableElement = document.getElementById(tableId);
    if (!tableElement) {
      alert("Табелата не е пронајдена за печатење.");
      return;
    }

    const printContent = tableElement.outerHTML;

    const d = new Date(date);
    const formattedDate = `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}.${d.getFullYear()}`;

    const printWindow = window.open("", "", "height=800,width=1000");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              text-align: center;
              margin-bottom: 0.25rem;
            }
            h2 {
              text-align: center;
              font-size: 1rem;
              margin-top: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              border: 1px solid #000;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: white;
              color: black;
              font-weight: bold;
            }
            .actionButtons, .actionButtons * {
              display: none;
            }
            th.email, td.email {
              display: none;
            }
            button {
              display: none;
            }
            tfoot td {
              font-weight: bold;
              background: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <h2>${formattedDate}</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 500);
    };
  }

  if (loading) return <p>Вчитување...</p>;

  return (
    <div className={styles.container}>
      {renderTable(
        filteredPending,
        selectedDateBerovo,
        setSelectedDateBerovo,
        pendingPageData,
        pendingPage,
        pendingPagesCount,
        setPendingPage,
        "pending-table",
        "Резервации во тек",
        true
      )}

      {renderTable(
        filteredBerovoSkopje,
        selectedDateBerovo,
        setSelectedDateBerovo,
        berovoPageData,
        berovoPage,
        berovoPagesCount,
        setBerovoPage,
        "berovo-table",
        "Берово → Скопје"
      )}

      {renderTable(
        filteredSkopjeBerovo,
        selectedDateSkopje,
        setSelectedDateSkopje,
        skopjePageData,
        skopjePage,
        skopjePagesCount,
        setSkopjePage,
        "skopje-table",
        "Скопје → Берово"
      )}

      <BookingForm
        submitButtonText="Додади резервација"
        onSubmitCallback={addReservation}
        title="Нова резервација"
        isAdmin={true}
      />

      <ModalCard
        show={modalOpen}
        message={modalMessage}
        closeModal={onCloseMessageModal}
      />

      <ConfirmReservationModal
        reservation={reservationToConfirm}
        onClose={() => {
          setReservationToConfirm(null);
          setConfirmModalOpen(false);
        }}
        onConfirm={updateStatusWithDirection}
        show={confirmModalOpen}
      />
    </div>
  );
};

export default AdminReservationsPanel;
