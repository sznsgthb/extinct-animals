import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Scroll from '../components/Scroll';
import VerticalTimeline from '../components/VerticalTimeline';
import WorldMap from '../components/WorldMap';
import './App.css';

// put all these parameters and stuff in const's so they can be received within the app function (video https://academy.zerotomastery.io/courses/complete-web-developer-zero-to-mastery/lectures/12678929)


function App() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAnimalData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://extinct-api.herokuapp.com/api/v1/animal/804");
                let sortedAnimals = response.data.data //Find out if it's possible to do the sorting and filtering outside of this useEffect() block
                    .filter(animal => animal.commonName !== "Patagonian panther")
                    .sort((a, b) => {
                        const parseYear = (year) => {
                            if (!year) return 0; // If there's no year, return 0
    // Handle BCE dates (e.g., "1900-1600 BCE")
                            const bcePattern = /(\d{1,5})\s?BCE/i;
                            if (bcePattern.test(year)) {
                                const match = year.match(bcePattern);
                                    if (match) {
                                        return -parseInt(match[1]); // Convert BCE to negative number
                                    }}
    // Handle ranges like "1900-1600 BCE", or "1900" as valid year
                            const rangePattern = /(\d{1,5})-(\d{1,5})/;
                            if (rangePattern.test(year)) {
                                const match = year.match(rangePattern);
                                    if (match) {
                                        const startYear = parseInt(match[1]);
                                        const endYear = parseInt(match[2]);
                                        return Math.min(startYear, endYear); // Return the earliest year from the range
                                    }}
    // Default: just parse a single year
                                return parseInt(year) || 0; // Return 0 if it's not a valid year
                        };
                        const yearA = parseYear(a.lastRecord);
                        const yearB = parseYear(b.lastRecord);
                        return yearA - yearB; // Ascending order (oldest first)
                    });
                
                

                    setAnimals(sortedAnimals);
    
                } catch (error) {
                    console.error("This didn't quite work out yet. Error:", error);
                } finally {
                    setLoading(false);
                }
            };
                

        fetchAnimalData();
    }, []);

    if (loading) { //Make an awesome loading screen here/new component that rises from 0 to 100
        return <h1 className="pa3 ma3">Loading...</h1>;
    }


    return (
        <>
            <div className="extinct-timeline">
                <h1 className="title" >Animals that have gone extinct</h1>
                    <h2>A timeline</h2>
                        <Scroll>
                            <VerticalTimeline animals={animals} />
                        </Scroll>
            </div>
        <br />
            <div className="extinct-location">
                <h2>A map</h2>
                    <WorldMap animals={animals} />
            </div>
        </>
    );
}

export default App;