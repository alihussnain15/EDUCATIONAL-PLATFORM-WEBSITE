const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const faqItems = document.querySelectorAll('.faq-item');
const generateUserBtn = document.getElementById('generateUserBtn');
const profileImg = document.getElementById('profileImg');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const feedbackForm = document.getElementById('feedbackForm');
const successMessage = document.getElementById('successMessage');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const calculatorButtons = document.querySelectorAll('.calculator-btn');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

function updateDisplay() {
    const display = document.getElementById('display');
    display.textContent = displayValue;
}

function appendValue(value) {
    if (waitingForSecondOperand) {
        displayValue = value;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? value : displayValue + value;
    }
    updateDisplay();
}

function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    waitingForSecondOperand = false;
    operator = null;
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation();
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
}

function performCalculation() {
    const inputValue = parseFloat(displayValue);
    
    if (operator === '+') {
        return firstOperand + inputValue;
    } else if (operator === '-') {
        return firstOperand - inputValue;
    } else if (operator === '*') {
        return firstOperand * inputValue;
    } else if (operator === '/') {
        return firstOperand / inputValue;
    }
    
    return inputValue;
}

function calculate() {
    if (!waitingForSecondOperand && operator) {
        const result = performCalculation();
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstOperand = result;
        waitingForSecondOperand = true;
        operator = null;
        updateDisplay();
    }
}

calculatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        const value = button.getAttribute('data-value');
        const operator = button.getAttribute('data-operator');
        
        if (value) {
            appendValue(value);
        } else if (operator) {
            handleOperator(operator);
        } else if (action === 'calculate') {
            calculate();
        } else if (action === 'clear') {
            clearDisplay();
        }
    });
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskId = 1;

function renderTasks() {
    taskList.innerHTML = '';
    taskCount.textContent = tasks.length;
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span>${task.text}</span>
            <button onclick="removeTask(${task.id})"><i class="fas fa-trash"></i></button>
        `;
        taskList.appendChild(li);
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    
    if (text) {
        tasks.push({
            id: taskId++,
            text: text,
            completed: false
        });
        
        taskInput.value = '';
        renderTasks();
    }
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function clearTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        renderTasks();
    }
}

addTaskBtn.addEventListener('click', addTask);
clearTasksBtn.addEventListener('click', clearTasks);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

if (tasks.length > 0) {
    taskId = Math.max(...tasks.map(task => task.id)) + 1;
}
renderTasks();

async function fetchRandomUser() {
    try {
        profileName.textContent = 'Loading...';
        generateUserBtn.disabled = true;
        generateUserBtn.innerHTML = '<div class="loading"></div> Generating...';
        
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
        
        profileImg.src = user.picture.large;
        profileName.textContent = `${user.name.first} ${user.name.last}`;
        profileEmail.textContent = user.email;
        
        generateUserBtn.disabled = false;
        generateUserBtn.textContent = 'Generate New User';
    } catch (error) {
        console.error('Error fetching user:', error);
        profileName.textContent = 'Error loading user';
        profileEmail.textContent = 'Please try again';
        
        generateUserBtn.disabled = false;
        generateUserBtn.textContent = 'Try Again';
    }
}

generateUserBtn.addEventListener('click', fetchRandomUser);

fetchRandomUser();

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    const name = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (!name.value.trim()) {
        nameError.style.display = 'block';
        isValid = false;
    } else {
        nameError.style.display = 'none';
    }
    
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }
    
    const rating = document.querySelector('input[name="rating"]:checked');
    const ratingError = document.getElementById('ratingError');
    if (!rating) {
        ratingError.style.display = 'block';
        isValid = false;
    } else {
        ratingError.style.display = 'none';
    }
    
    const message = document.getElementById('message');
    const messageError = document.getElementById('messageError');
    if (!message.value.trim()) {
        messageError.style.display = 'block';
        isValid = false;
    } else {
        messageError.style.display = 'none';
    }
    
    if (isValid) {
        successMessage.style.display = 'block';
        feedbackForm.reset();
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});

updateDisplay();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});