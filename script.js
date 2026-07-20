
const affirmations = {
    happy: [
        "Smile ka na plssssss",
        "You have the most contagious laugh that makes everyone around you happy!",
        "Ilove your positive energyyy!",
        "You're like a ray of sunshine on even the cloudiest days!",
        "Your happiness is so genuine and beautiful to witness!",
        "You have this amazing ability to find joy in the simplest things!",
        "Your enthusiasm for life is absolutely infectious!",
        "You make the world a brighter place just by being you!",
        "Your joy is like a warm hug that everyone needs!",
        "You're proof that happiness is a choice, and you choose it beautifully!"
    ],
    sad: [
        "It's okay to feel sad sometimes - you're human and that's beautiful. Okay lang yan!",
        "Your feelings are valid, and you're allowed to take time to heal!",
        "You're stronger than you know, and this feeling won't last forever!",
        "You have a heart of gold, and brighter days are ahead!",
        "Your sensitivity is a superpower, not a weakness!",
        "You're doing better than you think, even on your hardest days!",
        "Your tears are just your heart's way of healing!",
        "You're not alone in feeling this way, and you're loved!",
        "Your sadness doesn't define you - your strength does!",
        "You have the courage to get through anything life throws at you!",
        "Ok lang yan... iiyak mo yan!"
    ],
    stressed: [
        "You're handling this stress with more grace than you realize!",
        "Take a deep breath - you've got this, one step at a time!",
        "Your resilience in tough times is absolutely remarkable!",
        "You're stronger than any challenge that comes your way!",
        "Remember to be kind to yourself - you're doing your best!",
        "Your ability to keep going under pressure is inspiring!",
        "This stress is temporary, but your strength is permanent!",
        "You have everything you need to overcome this moment!",
        "Your determination to push through is admirable!",
        "You're not just surviving stress, you're growing through it!"
    ],
    confident: [
        "You have this incredible inner strength that shines through everything you do!",
        "Your confidence is magnetic and draws people to your amazing energy!",
        "You know your worth, and that's the most powerful thing!",
        "Your self-assurance is inspiring to everyone around you!",
        "You carry yourself with such grace and poise!",
        "Your belief in yourself is contagious and uplifting!",
        "You have this natural leadership quality that's undeniable!",
        "Your confidence comes from a place of authenticity and that's beautiful!",
        "You're not afraid to be yourself, and that's incredibly brave!",
        "Your self-assurance makes you unstoppable!"
    ],
    loved: [
        "You are so deeply loved, more than words could ever express!",
        "Your heart has the capacity to love and be loved infinitely!",
        "You deserve all the love in the world, and so much more!",
        "Your love for others is a gift that makes the world better!",
        "You are worthy of love, respect, and kindness!",
        "Your capacity to love unconditionally is extraordinary!",
        "You bring so much love and warmth to everyone you meet!",
        "Your heart is pure gold, and you're surrounded by love!",
        "You are loved beyond measure, just as you are!",
        "Your love story is still being written, and it's going to be beautiful!"
    ]
};


const moodButtons = document.querySelectorAll('.mood-btn');
const generateBtn = document.getElementById('generateBtn');
const affirmationCard = document.getElementById('affirmationCard');
const affirmationText = document.getElementById('affirmationText');
const moodSnoopy = document.getElementById('moodSnoopy');
const submitForm = document.getElementById('submitForm');
const moodSelect = document.getElementById('moodSelect');
const affirmationInput = document.getElementById('affirmationInput');
const totalAffirmations = document.getElementById('totalAffirmations');
const userContributions = document.getElementById('userContributions');


const moodImages = {
    happy: 'images/snoopy_happy.jpg',
    sad: 'images/snoopy_sad.jpg',
    stressed: 'images/snoopy_stressed.gif',
    confident: 'images/snoopy_confident.jpg',
    loved: 'images/snoopy_loved.jpg',
    random: 'images/snoopy_random.jpg'
};

let selectedMood = null;
let userAffirmations = {};


document.addEventListener('DOMContentLoaded', function() {
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            
            
            this.classList.add('selected');
            
           
            selectedMood = this.dataset.mood;
            
            
            generateBtn.disabled = false;
            generateBtn.style.opacity = '1';
        });
    });

    
    generateBtn.addEventListener('click', generateAffirmation);

    
    submitForm.addEventListener('submit', handleSubmit);

    
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.6';

    
    loadUserAffirmations();
    updateStats();
});


function generateAffirmation() {
    if (!selectedMood) {
        alert('Please select a mood first!');
        return;
    }

    let affirmation;
    let allAffirmations = [];
    
    
    if (selectedMood === 'random') {
        
        Object.keys(affirmations).forEach(mood => {
            allAffirmations = allAffirmations.concat(affirmations[mood]);
            if (userAffirmations[mood]) {
                allAffirmations = allAffirmations.concat(userAffirmations[mood]);
            }
        });
    } else {
        
        allAffirmations = [...affirmations[selectedMood]];
        if (userAffirmations[selectedMood]) {
            allAffirmations = allAffirmations.concat(userAffirmations[selectedMood]);
        }
    }

    affirmation = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];

  
    affirmationCard.classList.add('hidden');
    
   
    setTimeout(() => {
       
        const imageSrc = moodImages[selectedMood];
        moodSnoopy.src = imageSrc;
        
        affirmationText.textContent = affirmation;
        affirmationCard.classList.remove('hidden');
        
       
        affirmationCard.style.animation = 'none';
        setTimeout(() => {
            affirmationCard.style.animation = 'bounce 0.6s ease';
        }, 10);
    }, 300);

    
    generateBtn.style.animation = 'none';
    setTimeout(() => {
        generateBtn.style.animation = 'bounce 0.6s ease';
    }, 10);
}


function handleSubmit(e) {
    e.preventDefault();
    
    const mood = moodSelect.value;
    const affirmation = affirmationInput.value.trim();
    
    if (!mood || !affirmation) {
        alert('Please fill in all fields!');
        return;
    }
    

    if (!userAffirmations[mood]) {
        userAffirmations[mood] = [];
    }
    userAffirmations[mood].push(affirmation);
    
    // Save to Firebase (when configured)
    saveAffirmationToFirebase(mood, affirmation);
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    submitForm.reset();
    
    // Update stats
    updateStats();
}

// Save affirmation to Firebase
function saveAffirmationToFirebase(mood, affirmation) {
    if (window.firebaseDatabase) {
        const database = window.firebaseDatabase;
        const ref = window.firebaseRef;
        const push = window.firebasePush;
        const set = window.firebaseSet;
        
        const affirmationsRef = ref(database, 'affirmations/' + mood);
        const newAffirmationRef = push(affirmationsRef);
        
        set(newAffirmationRef, {
            text: affirmation,
            timestamp: Date.now(),
            mood: mood
        });
    }
}


function loadUserAffirmations() {
    if (window.firebaseDatabase) {
        const database = window.firebaseDatabase;
        const ref = window.firebaseRef;
        const get = window.firebaseGet;
        
        const affirmationsRef = ref(database, 'affirmations');
        
        get(affirmationsRef)
            .then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    Object.keys(data).forEach(mood => {
                        userAffirmations[mood] = [];
                        Object.keys(data[mood]).forEach(key => {
                            userAffirmations[mood].push(data[mood][key].text);
                        });
                    });
                }
                updateStats();
            })
            .catch((error) => {
                console.log("Error loading affirmations:", error);
            });
    }
}


function updateStats() {
    let total = 0;
    let userTotal = 0;
    
   
    Object.keys(affirmations).forEach(mood => {
        total += affirmations[mood].length;
    });
    
    
    Object.keys(userAffirmations).forEach(mood => {
        if (userAffirmations[mood]) {
            total += userAffirmations[mood].length;
            userTotal += userAffirmations[mood].length;
        }
    });
    
    totalAffirmations.textContent = total;
    userContributions.textContent = userTotal;
}


function showSuccessMessage() {
    
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <div class="success-content">
            <div class="success-icon">🎉</div>
            <h3>Thank you!</h3>
            <p>Your affirmation has been added to Snoopy's collection and shared with everyone! 💖</p>
        </div>
    `;
    
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        text-align: center;
        backdrop-filter: blur(10px);
        border: 2px solid #27ae60;
        animation: slideIn 0.5s ease;
    `;
    
    
    if (!document.querySelector('#success-styles')) {
        const style = document.createElement('style');
        style.id = 'success-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            .success-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            .success-content h3 {
                color: #27ae60;
                margin-bottom: 10px;
            }
            .success-content p {
                color: #7f8c8d;
            }
        `;
        document.head.appendChild(style);
    }
    

    document.body.appendChild(successMsg);
    
    
    setTimeout(() => {
        successMsg.style.animation = 'slideIn 0.5s ease reverse';
        setTimeout(() => {
            document.body.removeChild(successMsg);
        }, 500);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    
    setTimeout(() => {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.animation = 'fadeIn 1s ease forwards';
        }
    }, 500);
    
    
    if (!document.querySelector('#fade-styles')) {
        const style = document.createElement('style');
        style.id = 'fade-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}); 
