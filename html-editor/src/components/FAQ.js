import React, { useState } from "react";
import "./FAQ.css";

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqData = [
        {
            question: "What is this HTML/CSS Editor?",
            answer: "It is an online code editor built with React and Monaco Editor that allows users to write and preview HTML and CSS in real-time."
        },
        {
            question: "Does the preview update automatically?",
            answer: "Yes, the preview updates instantly using iframe and srcDoc whenever you change the code."
        },
        {
            question: "Can I download my code?",
            answer: "Yes, you can download your code as an HTML file using the Save Code button."
        },
        {
            question: "Is this project beginner friendly?",
            answer: "Yes, this project is designed to help beginners understand live code editing and React state management."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq-container">
            <h2 className="faq-title">Frequently Asked Questions</h2>

            {faqData.map((item, index) => (
                <div key={index} className="faq-item">
                    <div
                        className="faq-question"
                        onClick={() => toggleFAQ(index)}
                    >
                        {item.question}
                        <span>{activeIndex === index ? "-" : "+"}</span>
                    </div>

                    {activeIndex === index && (
                        <div className="faq-answer">
                            {item.answer}
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}

export default FAQ;