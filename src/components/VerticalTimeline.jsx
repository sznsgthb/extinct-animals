import { Chrono } from "react-chrono";
import './VerticalTimeline.css';
import placeholderImage from '../illustrations/noimage.svg';

const VerticalTimeline = ({ animals }) => {
    if (!Array.isArray(animals) || animals.length === 0) {
        return <h2>No extinct animals found.</h2>;
    }


    const timelineItems = animals.map(animal => ({
        title: animal.binomialName,
        cardTitle: animal.commonName,
        cardSubtitle: `Last seen ${animal.lastRecord || "Unknown"}`,
        cardDetailedText: (
            <div>
                <p>{animal.shortDesc || "No description available."}</p>
                    {animal.wikiLink && (
                            <a href={animal.wikiLink} target="_blank" rel="noopener noreferrer"> Read more on Wikipedia</a>
                    )}
            </div>
        ),
        media: {
        type: "IMAGE",
        source: { 
        url: (animal.imageSrc && animal.imageSrc !== "false") ? animal.imageSrc : placeholderImage 
        }}
    }));

    return (
        <div style={{ width: "750", height: "950px" }}>
            <Chrono
                items={timelineItems}
                mode="VERTICAL_ALTERNATING"
                focusActiveItemOnLoad
                theme={{
                    primary: 'rgb(184, 145, 125)',
                    secondary: 'rgb(255, 248, 229)',
                    cardBgColor: 'rgb(250, 250, 250)',
                     titleColor: 'rgb(60, 69, 73)',
                    titleColorActive: 'rgb(60, 69, 73)',
                }}>
            </Chrono>
        </div>
    );
};

export default VerticalTimeline;