// components/FAQ.tsx
import React from 'react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    return (
        <div className="bg-[#F9EA8240] w-full rotate-1 hover:rotate-0 transition-transform duration-200 ease-in-out text-black rounded-xl p-4 flex flex-col gap-2 mb-6 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-[#2F0007]">{question}</h3>
            <p className="text-sm text-[#2F0007]">{answer}</p>
        </div>
    );
};

interface FAQProps {
    faqItems: FAQItemProps[];
}

const FAQ: React.FC<FAQProps> = ({ faqItems }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {faqItems.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
        </div>
    );
};

export default FAQ;