import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Scroll from '../components/Scroll';
import VerticalTimeline from '../components/VerticalTimeline';
import WorldMap from '../components/WorldMap';
import './App.css';


function App() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAnimalData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://extinct-api.herokuapp.com/api/v1/animal/804");
                let sortedAnimals = response.data.data 
                    .filter(animal => animal.commonName !== "Patagonian panther")
                    .sort((a, b) => {
                        const parseYear = (year) => {
                            if (!year) return 0; 

                            const bcePattern = /(\d{1,5})\s?BCE/i;
                            if (bcePattern.test(year)) {
                                const match = year.match(bcePattern);
                                    if (match) {
                                        return -parseInt(match[1]); 
                                    }}

                            const rangePattern = /(\d{1,5})-(\d{1,5})/;
                            if (rangePattern.test(year)) {
                                const match = year.match(rangePattern);
                                    if (match) {
                                        const startYear = parseInt(match[1]);
                                        const endYear = parseInt(match[2]);
                                        return Math.min(startYear, endYear); 
                                    }}

                                return parseInt(year) || 0; 
                        };
                        const yearA = parseYear(a.lastRecord);
                        const yearB = parseYear(b.lastRecord);
                        return yearA - yearB; 
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

    if (loading) {
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