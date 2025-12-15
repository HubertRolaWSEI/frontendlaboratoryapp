'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/lib/AuthContext';
import { db } from '@/app/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import { FiChevronLeft, FiChevronRight, FiClock, FiPlus } from 'react-icons/fi';

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const formatDateForInput = (date) => {
    if (!date) return '';
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date - offset)).toISOString().slice(0, 10);
    return localISOTime;
};

const getWeekHeaderLabel = (startDate) => {
    const endDate = addDays(startDate, 6); 
    const startMonth = startDate.toLocaleDateString('pl-PL', { month: 'long' });
    const startYear = startDate.getFullYear();
    const endMonth = endDate.toLocaleDateString('pl-PL', { month: 'long' });
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
        return `${startMonth} ${startYear}`;
    } else if (startYear === endYear) {
        return `${startMonth} - ${endMonth} ${startYear}`;
    } else {
        return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
    }
};

const getEventColorStyle = (title) => {
    const styles = [
        { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-700', label: 'bg-indigo-100 text-indigo-700' },
        { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700', label: 'bg-emerald-100 text-emerald-700' },
        { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', label: 'bg-amber-100 text-amber-700' },
        { bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-700', label: 'bg-rose-100 text-rose-700' },
        { bg: 'bg-sky-50', border: 'border-sky-500', text: 'text-sky-700', label: 'bg-sky-100 text-sky-700' },
        { bg: 'bg-violet-50', border: 'border-violet-500', text: 'text-violet-700', label: 'bg-violet-100 text-violet-700' },
    ];
    
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % styles.length;
    return styles[index];
};

export default function Schedule() {
  const { user } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); 
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); 

  const fetchEvents = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const q = query(collection(db, "events"), where("user", "==", userDocRef));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              ...data,
              startTime: data.startTime?.seconds ? new Date(data.startTime.seconds * 1000) : null
          };
      });
      setEvents(eventsList);
    } catch (error) {
      console.error("Błąd pobierania:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentWeekStart(getMonday(new Date()));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handlePrevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const handleNextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const openCreateModal = (date, hour) => {
    const dateStr = formatDateForInput(date);
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    setFormData({ title: '', description: '', date: dateStr, time: timeStr });
    setModalMode('create');
    setSelectedEventId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event, e) => {
    if (e) e.stopPropagation(); 
    const dateStr = formatDateForInput(event.startTime);
    const timeStr = event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setFormData({
        title: event.title,
        description: event.description,
        date: dateStr,
        time: timeStr
    });
    setModalMode('edit');
    setSelectedEventId(event.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
        const combinedDate = new Date(`${formData.date}T${formData.time}`);
        const eventData = {
            title: formData.title,
            description: formData.description,
            startTime: Timestamp.fromDate(combinedDate),
            user: doc(db, "users", user.uid)
        };
        if (modalMode === 'create') {
            await addDoc(collection(db, "events"), eventData);
        } else {
            await updateDoc(doc(db, "events", selectedEventId), eventData);
        }
        setIsModalOpen(false);
        await fetchEvents();
    } catch (error) {
        console.error("Błąd zapisu:", error);
        alert("Wystąpił błąd podczas zapisu.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
      if(!selectedEventId || !confirm("Czy na pewno chcesz usunąć te zajęcia?")) return;
      try {
          await deleteDoc(doc(db, "events", selectedEventId));
          setEvents(prev => prev.filter(ev => ev.id !== selectedEventId));
          setIsModalOpen(false);
      } catch (error) {
          console.error("Błąd usuwania:", error);
      }
  };

  const getEventForSlot = (dayDate, hour) => {
      return events.find(event => {
          if (!event.startTime) return false;
          return isSameDay(event.startTime, dayDate) && event.startTime.getHours() === hour;
      });
  };

  if (loading && events.length === 0) return <div className="p-12 text-center text-gray-500">Wczytywanie harmonogramu...</div>;

  return (
    <section className="text-gray-600 body-font relative min-h-screen pb-24 md:pb-0">
      <div className="container px-2 py-4 mx-auto h-full flex flex-col">
        
        {/* === NAGŁÓWEK KALENDARZA === */}
        <div className="flex justify-between items-center mb-6 px-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <button onClick={handlePrevWeek} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200">
                 <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl md:text-2xl font-black text-gray-800 text-center capitalize tracking-tight">
                {getWeekHeaderLabel(currentWeekStart)}
            </h2>
            
            <button onClick={handleNextWeek} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200">
                <FiChevronRight className="w-5 h-5" />
            </button>
        </div>

        {/* === WIDOK DESKTOPOWY === */}
        <div className="hidden md:block flex-grow bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex flex-col h-full max-h-[800px] overflow-auto custom-scrollbar">
                
                {/* Nagłówki dni */}
                <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                    <div className="p-4 border-r border-gray-50 bg-gray-50/50"></div>
                    {weekDays.map((day, index) => {
                         const isToday = isSameDay(day, new Date());
                         return (
                            <div key={index} className={`py-4 px-2 text-center border-r border-gray-50 last:border-r-0 flex flex-col items-center justify-center ${isToday ? 'bg-indigo-50/40' : ''}`}>
                                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    {day.toLocaleDateString('pl-PL', { weekday: 'short' })}
                                </span>
                                <div className={`w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-gray-800'}`}>
                                    {day.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Siatka godzin */}
                <div className="relative">
                    {hours.map((hour, index) => (
                        <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] min-h-[8rem] group/row">
                            {/* Kolumna godzin */}  
                            <div className="p-3 text-right border-r border-gray-50 bg-white relative">
                                <span className={`text-xs font-medium text-gray-400 absolute right-3 bg-white px-1 ${index === 0 ? 'top-2' : 'top-[-8px]'}`}>
                                    {hour}:00
                                </span>
                            </div>

                            {/* Komórki dni */}
                            {weekDays.map((day, dayIndex) => {
                                const event = getEventForSlot(day, hour);
                                const isToday = isSameDay(day, new Date());
                                const styles = event ? getEventColorStyle(event.title) : null;
                                
                                return (
                                    <div 
                                        key={dayIndex} 
                                        className={`
                                            relative border-r border-b border-gray-50 border-dashed last:border-r-0 p-1.5 transition-colors 
                                            hover:bg-gray-50/80 cursor-pointer group/cell
                                            ${isToday ? 'bg-indigo-50/10' : ''}
                                        `}
                                        onClick={() => openCreateModal(day, hour)}
                                    >
                                        {event ? (
                                            <div 
                                                onClick={(e) => openEditModal(event, e)}
                                                className={`
                                                    h-full w-full rounded-lg bg-white 
                                                    border-l-[5px] ${styles.border}
                                                    shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 
                                                    p-2.5 flex flex-col justify-start relative overflow-hidden group/card
                                                    ${styles.bg} border-y border-r border-gray-100
                                                `}
                                            >
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-black/5 ${styles.label}`}>
                                                        {hour}:00 - {hour + 1}:00
                                                    </span>
                                                </div>
                                                <h4 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${styles.text.replace('700', '900')}`}>
                                                    {event.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {event.description}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center">
                                                    <FiPlus className="w-5 h-5" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* === WIDOK MOBILNY (Lista) === */}
        <div className="block md:hidden space-y-4">
            {weekDays.map((day, index) => {
                const dayEvents = events.filter(event => event.startTime && isSameDay(event.startTime, day));
                dayEvents.sort((a, b) => a.startTime - b.startTime);
                const isToday = isSameDay(day, new Date());

                return (
                    <div key={index} className={`bg-white rounded-xl shadow-sm border ${isToday ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'} overflow-hidden`}>
                        <div className={`px-4 py-3 flex justify-between items-center ${isToday ? 'bg-indigo-50' : 'bg-gray-50'} border-b border-gray-100`}>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold capitalize ${isToday ? 'text-indigo-700' : 'text-gray-700'}`}>
                                    {day.toLocaleDateString('pl-PL', { weekday: 'long' })}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {day.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
                                </span>
                            </div>
                            <button 
                                onClick={() => openCreateModal(day, 8)}
                                className="text-indigo-500 hover:bg-indigo-100 p-2 rounded-full transition-colors"
                            >
                                <FiPlus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-2">
                            {dayEvents.length > 0 ? (
                                <div className="space-y-2">
                                    {dayEvents.map(event => {
                                        const styles = getEventColorStyle(event.title);
                                        return (
                                            <div 
                                                key={event.id} 
                                                onClick={(e) => openEditModal(event, e)}
                                                className={`flex items-start p-3 bg-white border border-gray-100 rounded-lg hover:border-indigo-200 transition-colors shadow-sm active:scale-[0.99] transform duration-100 border-l-4 ${styles.border}`}
                                            >
                                                <div className="flex-shrink-0 w-16 text-center mr-3 pt-1">
                                                    <span className="flex items-center justify-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        <FiClock className="w-3 h-3" />
                                                        {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className={`text-sm font-bold leading-tight ${styles.text}`}>{event.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{event.description || 'Brak opisu'}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-6 text-center">
                                    <p className="text-xs text-gray-400 italic">Brak zaplanowanych zajęć</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        <button
            onClick={() => openCreateModal(new Date(), 8)}
            className="md:hidden fixed bottom-6 right-5 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center text-2xl hover:bg-indigo-700 active:scale-90 transition-all z-40"
            aria-label="Dodaj zajęcia"
        >
            <FiPlus />
        </button>

      </div>
      
      {/* === MODAL === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">
                        {modalMode === 'create' ? 'Dodaj Zajęcia' : 'Edytuj Zajęcia'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6">
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Nazwa przedmiotu</label>
                        <input 
                            type="text" required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm py-2.5 px-3 border outline-none"
                            placeholder="np. Matematyka Dyskretna"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Opis / Sala</label>
                        <input 
                            type="text"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm py-2.5 px-3 border outline-none"
                            placeholder="np. Sala 102"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Data</label>
                            <input 
                                type="date" required
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm py-2.5 px-3 border outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Godzina</label>
                            <input 
                                type="time" required
                                value={formData.time}
                                onChange={e => setFormData({...formData, time: e.target.value})}
                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm py-2.5 px-3 border outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        {modalMode === 'edit' ? (
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Usuń
                            </button>
                        ) : <div></div>}
                        
                        <div className="flex space-x-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Anuluj
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5"
                            >
                                {isSubmitting ? 'Zapisywanie...' : 'Zapisz'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}
    </section>
  );
}