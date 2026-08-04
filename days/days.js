const EXERCISES = {
    1: {
        name: 'Сгибание рук с EZ-штангой',
        reps: 10,
        weight: 20,
        targetSets: 4,
        listId: 'setsList1',
        infoId: 'totalInfo1',
        prId: 'pr1',
        weightDisplayId: 'weightDisplay1',
        repsDisplayId: 'repsDisplay1',
        hasWeight: true,
        weightStep: 1
    },
    2: {
        name: 'Скручивания на наклонной скамье',
        reps: 15,
        weight: 0,
        targetSets: 3,
        listId: 'setsList2',
        infoId: 'totalInfo2',
        prId: 'pr2',
        repsDisplayId: 'repsDisplay2',
        hasWeight: false
    },
    3: {
        name: 'Обратные подтягивания',
        reps: 8,
        weight: 0,
        targetSets: 4,
        listId: 'setsList3',
        infoId: 'totalInfo3',
        prId: 'pr3',
        repsDisplayId: 'repsDisplay3',
        hasWeight: false
    },
    4: {
        name: 'Жим лежа',
        reps: 10,
        weight: 60,
        targetSets: 4,
        listId: 'setsList4',
        infoId: 'totalInfo4',
        prId: 'pr4',
        weightDisplayId: 'weightDisplay4',
        repsDisplayId: 'repsDisplay4',
        hasWeight: true,
        weightStep: 1
    },
    5: {
        name: 'Подтягивания прямым хватом',
        reps: 8,
        weight: 0,
        targetSets: 4,
        listId: 'setsList5',
        infoId: 'totalInfo5',
        prId: 'pr5',
        repsDisplayId: 'repsDisplay5',
        hasWeight: false
    },
    6: {
        name: 'Тяга вертикального блока к груди',
        reps: 12,
        weight: 0,
        targetSets: 4,
        listId: 'setsList6',
        infoId: 'totalInfo6',
        prId: 'pr6',
        repsDisplayId: 'repsDisplay6',
        hasWeight: false
    }
};

const HISTORY_KEY = 'workoutHistory';
const PR_KEY = 'personalRecords';

function getMoscowDate() {
    const now = new Date();
    const moscowOffset = 3 * 60;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const moscowTime = new Date(utc + moscowOffset * 60000);
    return moscowTime.toISOString().split('T')[0];
}

function getMoscowDateTime() {
    const now = new Date();
    const moscowOffset = 3 * 60;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const moscowTime = new Date(utc + moscowOffset * 60000);
    return moscowTime.toISOString();
}

function getHistory() {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : {};
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function getPRData() {
    const data = localStorage.getItem(PR_KEY);
    return data ? JSON.parse(data) : {};
}

function savePRData(prData) {
    localStorage.setItem(PR_KEY, JSON.stringify(prData));
}

function getExerciseHistory(exerciseId) {
    const history = getHistory();
    return history[exerciseId] || [];
}

function saveExerciseHistory(exerciseId, entry) {
    const history = getHistory();
    if (!history[exerciseId]) {
        history[exerciseId] = [];
    }
    history[exerciseId].push(entry);
    saveHistory(history);
}

function getPR(exerciseId) {
    const prData = getPRData();
    return prData[exerciseId] || null;
}

function setPR(exerciseId, reps, weight, date) {
    const exercise = EXERCISES[exerciseId];
    const prData = getPRData();
    
    const today = date || getMoscowDate();
    
    if (exercise.hasWeight) {
        prData[exerciseId] = {
            reps: reps,
            weight: weight,
            date: today
        };
    } else {
        prData[exerciseId] = {
            reps: reps,
            date: today
        };
    }
    
    savePRData(prData);
    updatePRDisplay(exerciseId);
}

function updatePRDisplay(exerciseId) {
    const exercise = EXERCISES[exerciseId];
    const pr = getPR(exerciseId);
    const prDiv = document.getElementById(exercise.prId);
    
    if (pr) {
        const date = new Date(pr.date + 'T00:00:00+03:00');
        const dateStr = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Europe/Moscow'
        });
        let prText = '🏆 Рекорд: ' + pr.reps + ' раз';
        if (exercise.hasWeight && pr.weight && pr.weight > 0) {
            prText += ' × ' + pr.weight + 'кг';
        }
        prText += ' (' + dateStr + ')';
        prDiv.innerHTML = prText;
        prDiv.style.display = 'block';
    } else {
        prDiv.innerHTML = 'Нет рекорда';
        prDiv.style.display = 'block';
    }
}

function changeWeight(exerciseId, delta) {
    const exercise = EXERCISES[exerciseId];
    if (!exercise.hasWeight) return;
    exercise.weight = Math.max(0, exercise.weight + delta);
    const display = document.getElementById(exercise.weightDisplayId);
    if (display) {
        display.textContent = exercise.weight;
    }
}

function changeReps(exerciseId, delta) {
    const exercise = EXERCISES[exerciseId];
    exercise.reps = Math.max(1, exercise.reps + delta);
    const display = document.getElementById(exercise.repsDisplayId);
    if (display) {
        display.textContent = exercise.reps;
    }
}

function setCustomPR(exerciseId) {
    const exercise = EXERCISES[exerciseId];
    const repsInput = prompt('Введите количество повторений:', exercise.reps);
    if (repsInput === null) return;
    
    const reps = parseInt(repsInput);
    if (isNaN(reps) || reps < 1) {
        alert('Введите корректное число повторений');
        return;
    }
    
    let weight = 0;
    if (exercise.hasWeight) {
        const weightInput = prompt('Введите вес (кг):', exercise.weight);
        if (weightInput === null) return;
        weight = parseInt(weightInput);
        if (isNaN(weight) || weight < 0) {
            alert('Введите корректный вес');
            return;
        }
    }
    
    const today = getMoscowDate();
    setPR(exerciseId, reps, weight, today);
    
    let message = 'Рекорд сохранён!\n' + reps + ' раз';
    if (exercise.hasWeight && weight > 0) {
        message += ' × ' + weight + ' кг';
    }
    message += '\nДата: ' + new Date(today + 'T00:00:00+03:00').toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Moscow'
    });
    alert(message);
}

function startWorkout(exerciseName, exerciseId) {
    const exercise = EXERCISES[exerciseId];
    
    if (!exercise) {
        alert('Упражнение не найдено');
        return;
    }

    const reps = exercise.reps;
    const weight = exercise.weight;
    const today = getMoscowDate();
    const now = getMoscowDateTime();
    
    const list = document.getElementById(exercise.listId);
    const infoDiv = document.getElementById(exercise.infoId);
    
    const setNumber = list.children.length + 1;
    
    let weightText = '';
    if (exercise.hasWeight && weight > 0) {
        weightText = weight + 'кг × ';
    }
    
    const timeStr = new Date(now).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Moscow'
    });
    
    const html = '<div class="set-item">' +
                 '<span class="set-number">#' + setNumber + '</span>' +
                 '<span class="set-name">' + exerciseName + '</span>' +
                 '<span class="set-reps">' + weightText + reps + ' раз</span>' +
                 '<span class="set-time">' + timeStr + '</span>' +
                 '</div>';
    
    list.innerHTML += html;
    
    const totalSets = list.children.length;
    const remaining = exercise.targetSets - totalSets;
    
    let infoHtml = 'Всего подходов: ' + totalSets + ' из ' + exercise.targetSets;
    if (remaining > 0) {
        infoHtml += ' | Осталось: ' + remaining;
    } else if (remaining === 0) {
        infoHtml += ' | Выполнено!';
        
        const currentPR = getPR(exerciseId);
        let isNewPR = false;
        
        if (!currentPR) {
            isNewPR = true;
        } else if (exercise.hasWeight) {
            if (reps > currentPR.reps) {
                isNewPR = true;
            } else if (reps === currentPR.reps && weight > currentPR.weight) {
                isNewPR = true;
            }
        } else {
            if (reps > currentPR.reps) {
                isNewPR = true;
            }
        }
        
        if (isNewPR) {
            setPR(exerciseId, reps, weight, today);
            let prMessage = '🎉 Новый рекорд!\n' + reps + ' раз';
            if (exercise.hasWeight && weight > 0) {
                prMessage += ' × ' + weight + ' кг';
            }
            prMessage += '\nДата: ' + new Date(today + 'T00:00:00+03:00').toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'Europe/Moscow'
            });
            alert(prMessage);
        }
    } else {
        infoHtml += ' | Перевыполнено!';
    }
    
    infoDiv.innerHTML = infoHtml;
}

function exportData() {
    const history = getHistory();
    const prData = getPRData();
    
    if (Object.keys(history).length === 0 && Object.keys(prData).length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    const fullData = {
        history: history,
        records: prData,
        exportDate: getMoscowDateTime()
    };
    
    const dataStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout_data_' + getMoscowDate() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (data.history) {
                    saveHistory(data.history);
                }
                if (data.records) {
                    savePRData(data.records);
                }
                alert('Данные импортированы успешно!');
                location.reload();
            } catch (error) {
                alert('Ошибка при чтении файла');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function resetExercise(exerciseId) {
    const history = getHistory();
    if (history[exerciseId]) {
        delete history[exerciseId];
        saveHistory(history);
    }
    
    const prData = getPRData();
    if (prData[exerciseId]) {
        delete prData[exerciseId];
        savePRData(prData);
    }
    
    const exercise = EXERCISES[exerciseId];
    const list = document.getElementById(exercise.listId);
    const infoDiv = document.getElementById(exercise.infoId);
    list.innerHTML = '';
    infoDiv.innerHTML = '';
    updatePRDisplay(exerciseId);
    alert('Данные для "' + exercise.name + '" сброшены');
}

function resetAllData() {
    if (confirm('Удалить все данные о тренировках и рекордах?')) {
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(PR_KEY);
        location.reload();
    }
}
