let currentStep = 1;
let selectedConfirmerType = '';
let headsMeaning = 'yes';
let numberOfConfirms = 1;
let results = [];
let currentConfirm = 0;
let isAnimating = false;

function nextStep() {
    const question = document.getElementById('question').value.trim();
    if (currentStep === 1 && question === '') {
        alert('Please enter your question first!');
        return;
    }
    
    if (currentStep < 5) {
        document.getElementById(`step${currentStep}`).style.display = 'none';
        currentStep++;
        document.getElementById(`step${currentStep}`).style.display = 'block';
    }
}

function selectConfirmerType(type) {
    selectedConfirmerType = type;
    
    if (type === 'coin') {
        document.getElementById('step2').style.display = 'none';
        currentStep = 3;
        document.getElementById('step3').style.display = 'block';
    } else {
        document.getElementById('step2').style.display = 'none';
        currentStep = 4;
        document.getElementById('step4').style.display = 'block';
    }
}

function selectConfirms(num) {
    numberOfConfirms = num;
    nextStep();
    setupFinalStep();
}

function selectCustomConfirms() {
    const customNum = parseInt(document.getElementById('customConfirms').value);
    if (customNum >= 1 && customNum <= 10) {
        numberOfConfirms = customNum;
        nextStep();
        setupFinalStep();
    } else {
        alert('Please enter a number between 1 and 10');
    }
}

function setupFinalStep() {
    document.getElementById('displayQuestion').textContent = document.getElementById('question').value;
    
    if (selectedConfirmerType === 'coin') {
        document.getElementById('coinDisplay').style.display = 'block';
        document.getElementById('wheelDisplay').style.display = 'none';
    } else {
        document.getElementById('coinDisplay').style.display = 'none';
        document.getElementById('wheelDisplay').style.display = 'block';
        drawWheel();
    }
    
    results = [];
    currentConfirm = 0;
    updateResultsDisplay();
}

function flipCoin() {
    if (isAnimating) return;
    
    isAnimating = true;
    const coin = document.getElementById('coinFlip');
    const resultText = document.getElementById('coinResult');
    
    coin.classList.add('flipping');
    resultText.textContent = 'Flipping...';
    
    const coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
    
    let result;
    if (coinResult === 'Heads') {
        result = headsMeaning === 'yes' ? 'Yes' : 'No';
    } else {
        result = headsMeaning === 'yes' ? 'No' : 'Yes';
    }
    
    setTimeout(() => {
        coin.classList.remove('flipping');
        resultText.textContent = `Coin: ${coinResult} = ${result}`;
        results.push(result);
        currentConfirm++;
        isAnimating = false;
        
        updateResultsDisplay();
        checkIfComplete();
    }, 2000);
}

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const segments = [];
    for (let i = 0; i < 12; i++) {
        segments.push(i % 2 === 0 ? 'Yes' : 'No');
    }
    
    const anglePerSegment = (2 * Math.PI) / 12;
    
    segments.forEach((segment, index) => {
        const startAngle = index * anglePerSegment;
        const endAngle = (index + 1) * anglePerSegment;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        if (segment === 'Yes') {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#f44336';
        }
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(segment, radius * 0.7, 5);
        ctx.restore();
    });
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function spinWheel() {
    if (isAnimating) return;
    
    isAnimating = true;
    const canvas = document.getElementById('wheelCanvas');
    const resultText = document.getElementById('wheelResult');
    
    resultText.textContent = 'Spinning...';
    
    const baseRotations = 5 + Math.random() * 5;
    const randomSegment = Math.random() * 12;
    const finalRotation = (baseRotations * 360) + (randomSegment * 30);
    
    canvas.style.setProperty('--final-rotation', `${finalRotation}deg`);
    canvas.classList.add('wheel-spinning');
    
    const normalizedRotation = finalRotation % 360;
    const segmentIndex = Math.floor((360 - normalizedRotation) / 30);
    const result = segmentIndex % 2 === 0 ? 'Yes' : 'No';
    
    setTimeout(() => {
        canvas.classList.remove('wheel-spinning');
        resultText.textContent = `Result: ${result}`;
        results.push(result);
        currentConfirm++;
        isAnimating = false;
        
        updateResultsDisplay();
        checkIfComplete();
    }, 3000);
}

function updateResultsDisplay() {
    const resultsList = document.getElementById('resultsList');
    const finalResult = document.getElementById('finalResult');
    const startBtn = document.getElementById('startBtn');
    
    resultsList.innerHTML = '';
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.textContent = `Confirm ${index + 1}: ${result}`;
        resultsList.appendChild(resultItem);
    });
    
    if (currentConfirm >= numberOfConfirms) {
        const finalDecision = calculateFinalResult();
        finalResult.textContent = `Final Decision: ${finalDecision}`;
        startBtn.textContent = 'Try Again';
        startBtn.onclick = startConfirmation;
    } else {
        finalResult.textContent = '';
        startBtn.textContent = `Start Confirm ${currentConfirm + 1} of ${numberOfConfirms}`;
        startBtn.onclick = startConfirmation;
    }
}

function calculateFinalResult() {
    if (results.length === 0) return 'No results yet';
    
    if (numberOfConfirms === 1) {
        return results[0];
    }
    
    const yesCount = results.filter(result => result === 'Yes').length;
    const noCount = results.filter(result => result === 'No').length;
    
    if (yesCount > noCount) {
        return 'Yes';
    } else if (noCount > yesCount) {
        return 'No';
    } else {
        return 'Tie - Try again!';
    }
}

function checkIfComplete() {
    if (currentConfirm >= numberOfConfirms) {
        setTimeout(() => {
            alert('All confirms completed! Check the final result below.');
        }, 500);
    }
}

function startConfirmation() {
    if (currentConfirm >= numberOfConfirms) {
        results = [];
        currentConfirm = 0;
        updateResultsDisplay();
    }
    
    if (selectedConfirmerType === 'coin') {
        flipCoin();
    } else {
        spinWheel();
    }
}

function resetApp() {
    currentStep = 1;
    selectedConfirmerType = '';
    headsMeaning = 'yes';
    numberOfConfirms = 1;
    results = [];
    currentConfirm = 0;
    isAnimating = false;
    
    document.getElementById('question').value = '';
    document.getElementById('customConfirms').value = '3';
    
    document.querySelector('input[value="yes"]').checked = true;
    
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`step${i}`).style.display = i === 1 ? 'block' : 'none';
    }
    
    document.getElementById('coinDisplay').style.display = 'none';
    document.getElementById('wheelDisplay').style.display = 'none';
    document.getElementById('coinResult').textContent = '';
    document.getElementById('wheelResult').textContent = '';
    
    document.getElementById('coinFlip').classList.remove('flipping');
    const canvas = document.getElementById('wheelCanvas');
    canvas.classList.remove('wheel-spinning');
    canvas.style.removeProperty('--final-rotation');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('question').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            nextStep();
        }
    });
    
    document.getElementById('customConfirms').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            selectCustomConfirms();
        }
    });
    
    document.querySelectorAll('input[name="headsMeaning"]').forEach(radio => {
        radio.addEventListener('change', function() {
            headsMeaning = this.value;
        });
    });
}); 