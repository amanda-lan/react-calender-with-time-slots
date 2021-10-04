import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { differenceInCalendarDays } from 'date-fns';
import Grid from '@material-ui/core/Grid'
import "./App.css"

function App() {
    const [value, onChange] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [text, setText] = useState('');
    const [disabledDates, setDisabledDates] = useState([]);
    const [timeSlots,setTimeSlots] = useState([]);

    function isSameDay(a, b) {
        return differenceInCalendarDays(a, b) === 0;
    }

    function tileDisabled({ date, view }) {
        // Disable tiles in month view only
        if (view === 'month') {
            // Check if a date React-Calendar wants to check is on the list of disabled dates
            return disabledDates.find(dDate => isSameDay(dDate, date));
        }
    }

    const handleSearch = (text) =>{
        if (text.length <= 4 ) {
            setText(text);
        }
    }

    useEffect(() => {
        const loadSlots = async () => {
            const response = await axios.get('http://localhost:3002?postcode=' + text);
            const disabledDatesArr = response.data.filter((d) => !d.available).map((d) => d.date);
            setDisabledDates(disabledDatesArr);
            setSlots(response.data)
        }
        if (text.length === 4) {
            loadSlots()
        }
    }, [text])

    useEffect(() => {
        const checkDate = value.toLocaleDateString('en-CA').toString();
        const timeAvailable = slots.filter((t) => t.date === checkDate).map((d) => d['slots']);
        setTimeSlots(timeAvailable[0]);
    }, [value, slots])

    return (
        <div className="App">
            <h1>Delivery Time Picker</h1>
            <Grid container>
                <Grid item xs={7} className="pad-left">
                    <label>Postcode Search: </label>
                    <input type="text"
                           className = "search-bar"
                           role="postcode-input"
                           value={text}
                           onChange={(e) =>handleSearch(e.target.value)}
                    />
                    <Calendar
                        showDoubleView = {true}
                        onChange = {onChange}
                        value = {value}
                        tileDisabled = {tileDisabled}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Grid item className="pad-top pad-left">
                        {timeSlots && timeSlots.length > 0 ? timeSlots
                                .filter(x => x['time_window'])
                                .map((timeSlot, index) => (
                            <Grid item xs={12} key={index}>
                                <input type="radio"/> {timeSlot['name']}
                                <label htmlFor="age1"/> {timeSlot['time_window']}
                            </Grid>
                            )) :
                            <>
                                <Grid item xs={12}>
                                    <input type="radio" disabled={true}/> am
                                    <label htmlFor="age1"/> 00:00 - 07:00
                                </Grid>
                                <Grid item xs={12}>
                                    <input type="radio"disabled={true}/> pm
                                    <label htmlFor="age1"/> 08:00 - 18:00
                                </Grid>
                            </>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </div>
  );
}

export default App;
