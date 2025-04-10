document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const backgroundColorPicker = document.getElementById('background-color');
    const resetColorBtn = document.getElementById('reset-color');
    const celebrationContainer = document.getElementById('celebration-container');
    const taskAddedContainer = document.getElementById('task-added-container');
    
    // Default background color
    const defaultBgColor = '#0f172a';
    
    // Audio elements
    const taskCompletedSound = new Audio('sounds/task-completed.mp3');
    const taskAddedSound = new Audio('sounds/task-added.mp3');
    
    // Lottie animations
    let celebrationAnimation = null;
    let taskAddedAnimation = null;
    
    // Create inline animations instead of loading from files
    function setupAnimations() {
        console.log("Setting up animations...");
        
        // Simple animation data for testing
        const celebrationAnimationData = {
            v: "5.7.4",
            fr: 30,
            ip: 0,
            op: 60,
            w: 300,
            h: 300,
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Circle",
                sr: 1,
                shapes: [{
                    ty: "el",
                    p: { a: 0, k: [150, 150] },
                    s: { 
                        a: 1, 
                        k: [
                            { t: 0, s: [0, 0], o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 } },
                            { t: 30, s: [200, 200] }
                        ] 
                    },
                    c: { a: 0, k: [0.5, 0.8, 0.2] }
                }]
            }]
        };
        
        const taskAddedAnimationData = {
            v: "5.7.4",
            fr: 30,
            ip: 0,
            op: 60,
            w: 300,
            h: 300,
            layers: [{
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Box",
                sr: 1,
                shapes: [{
                    ty: "rc",
                    p: { a: 0, k: [150, 150] },
                    s: { 
                        a: 1, 
                        k: [
                            { t: 0, s: [0, 0], o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 } },
                            { t: 30, s: [150, 150] }
                        ] 
                    },
                    c: { a: 0, k: [0.8, 0.3, 0.3] }
                }]
            }]
        };
        
        try {
            // Clear the containers first
            celebrationContainer.innerHTML = '';
            taskAddedContainer.innerHTML = '';
            
            // Initialize animations with simplified data
            celebrationAnimation = lottie.loadAnimation({
                container: celebrationContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: celebrationAnimationData
            });
            
            taskAddedAnimation = lottie.loadAnimation({
                container: taskAddedContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: taskAddedAnimationData
            });
            
            console.log("Animations loaded successfully");
            
            // Reset animation when complete
            celebrationAnimation.addEventListener('complete', () => {
                celebrationContainer.classList.remove('show');
                console.log("Celebration animation completed");
            });
            
            taskAddedAnimation.addEventListener('complete', () => {
                taskAddedContainer.classList.remove('show');
                console.log("Task added animation completed");
            });
        } catch (error) {
            console.error("Error setting up animations:", error);
        }
    }
    
    // Play celebration animation
    function playCelebration() {
        console.log("Playing celebration animation");
        
        try {
            celebrationContainer.classList.add('show');
            celebrationAnimation.stop();
            celebrationAnimation.play();
            
            // Always use Web Audio API for consistent sound playback
            playCompletionSound();
        } catch (error) {
            console.error("Error playing celebration animation:", error);
        }
    }
    
    // Play task added animation
    function playTaskAdded() {
        console.log("Playing task added animation");
        
        try {
            taskAddedContainer.classList.add('show');
            taskAddedAnimation.stop();
            taskAddedAnimation.play();
            
            // Always use Web Audio API for consistent sound playback
            playTaskAddedSound();
        } catch (error) {
            console.error("Error playing task added animation:", error);
        }
    }
    
    // Sound functions using Web Audio API
    function playCompletionSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create two oscillators for a more interesting sound
            const oscillator1 = audioCtx.createOscillator();
            const oscillator2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            // Set up the first oscillator (higher pitch)
            oscillator1.type = 'sine';
            oscillator1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
            oscillator1.connect(gainNode);
            
            // Set up the second oscillator (higher pitch, added later)
            oscillator2.type = 'sine';
            oscillator2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
            oscillator2.connect(gainNode);
            
            gainNode.connect(audioCtx.destination);
            
            // Create a nice envelope for the sound
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.2);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
            
            // Start and stop the oscillators with slight timing differences for a nice effect
            oscillator1.start(audioCtx.currentTime);
            oscillator2.start(audioCtx.currentTime + 0.1);
            
            oscillator1.stop(audioCtx.currentTime + 0.8);
            oscillator2.stop(audioCtx.currentTime + 0.8);
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    function playTaskAddedSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create an oscillator for a simple blip sound
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(349.23, audioCtx.currentTime); // F4
            oscillator.frequency.linearRampToValueAtTime(293.66, audioCtx.currentTime + 0.3); // D4 (falling tone)
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            // Quick fade in and out
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.4);
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTasksCounter();
        
        // Setup animations after a short delay to ensure DOM is ready
        setTimeout(() => {
            setupAnimations();
        }, 100);
        
        // Load saved background color if exists
        const savedBgColor = localStorage.getItem('bgColor');
        if (savedBgColor) {
            document.body.style.backgroundColor = savedBgColor;
            backgroundColorPicker.value = savedBgColor;
        }
        
        // Event listeners
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if in a form
                addTask();
            }
        });
        
        clearCompletedBtn.addEventListener('click', clearCompleted);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTasks();
            });
        });
        
        // Color picker event listener
        backgroundColorPicker.addEventListener('input', (e) => {
            const newColor = e.target.value;
            document.body.style.backgroundColor = newColor;
            localStorage.setItem('bgColor', newColor);
        });
        
        // Reset color button
        resetColorBtn.addEventListener('click', () => {
            document.body.style.backgroundColor = defaultBgColor;
            backgroundColorPicker.value = defaultBgColor;
            localStorage.setItem('bgColor', defaultBgColor);
        });
        
        // Delegation for task list events
        taskList.addEventListener('click', handleTaskListClick);
    }
    
    // Event handler for task list using event delegation
    function handleTaskListClick(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = Number(taskItem.dataset.id);
        
        // Handle checkbox click
        if (e.target.closest('.task-checkbox')) {
            const task = tasks.find(t => t.id === taskId);
            const isCompleting = !task.completed;
            
            toggleTaskCompletion(taskId);
            
            // Play celebration animation when task is completed
            if (isCompleting) {
                playCelebration();
            }
        }
        
        // Handle delete button click
        if (e.target.closest('.delete-btn')) {
            deleteTask(taskId);
        }
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) return;
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.unshift(newTask); // Add to the beginning of the array
        saveTasksToLocalStorage();
        renderTasks();
        updateTasksCounter();
        
        // Play task added animation
        playTaskAdded();
        
        // Reset input
        taskInput.value = '';
        taskInput.focus();
    }
    
    // Toggle task completion status
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasksToLocalStorage();
        renderTasks();
        updateTasksCounter();
    }
    
    // Delete a task
    function deleteTask(taskId) {
        const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
        
        // Animation before removing
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasksToLocalStorage();
            renderTasks();
            updateTasksCounter();
        }, 300);
    }
    
    // Clear completed tasks
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasksToLocalStorage();
        renderTasks();
        updateTasksCounter();
    }
    
    // Filter tasks based on current filter
    function getFilteredTasks() {
        switch(currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }
    
    // Render tasks with performance optimization
    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            taskItem.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}">
                    <i class="fas fa-check"></i>
                </div>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <button class="delete-btn">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            fragment.appendChild(taskItem);
        });
        
        // Clear and append all at once
        taskList.innerHTML = '';
        taskList.appendChild(fragment);
    }
    
    // Update tasks counter
    function updateTasksCounter() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }
    
    // Save tasks to localStorage
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Helper function to escape HTML
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Initialize the app
    init();
});
