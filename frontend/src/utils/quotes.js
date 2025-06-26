// A large, curated list of 25+ quotes for tech, productivity, and innovation.
const motivationalQuotes = [
    // Code & Engineering
    { quote: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { quote: "The best error message is the one that never appears.", author: "Thomas Fuchs" },
    { quote: "It's not a bug; it's an undocumented feature.", author: "Anonymous" },
    { quote: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates" },
    { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
    { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { quote: "One person's 'magic' is another person's engineering.", author: "Robert A. Heinlein" },
    
    // Productivity & Planning
    { quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
    { quote: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
    { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { quote: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
    { quote: "The secret to productivity is not finding more time, but managing your energy.", author: "Michael Hyatt" },
    { quote: "A good plan violently executed now is better than a perfect plan executed next week.", author: "George S. Patton" },

    // Innovation & Mindset
    { quote: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { quote: "A year from now you may wish you had started today.", author: "Karen Lamb" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "The goal is to turn data into information, and information into insight.", author: "Carly Fiorina" },
    { quote: "Strive for progress, not perfection.", author: "Anonymous" },
    { quote: "The future depends on what you do today.", author: "Anonymous" },
    { quote: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { quote: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
];

// This function can be called from any component to get a new random quote.
export const getRandomQuote = () => {
    if (!motivationalQuotes || motivationalQuotes.length === 0) {
        return { quote: "Get things done, one task at a time.", author: "TaskFlow" };
    }
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
};