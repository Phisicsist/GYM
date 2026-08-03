const ex = {
    1: { name: 'Сгибание рук с EZ-штангой', reps: 10, w: 20, sets: 4, list: 'setsList1', info: 'totalInfo1', pr: 'pr1', wd: 'weightDisplay1', rd: 'repsDisplay1', hasW: true, step: 1 },
    2: { name: 'Скручивания на наклонной скамье', reps: 15, w: 0, sets: 3, list: 'setsList2', info: 'totalInfo2', pr: 'pr2', rd: 'repsDisplay2', hasW: false },
    3: { name: 'Обратные подтягивания', reps: 8, w: 0, sets: 4, list: 'setsList3', info: 'totalInfo3', pr: 'pr3', rd: 'repsDisplay3', hasW: false },
    4: { name: 'Жим лежа', reps: 10, w: 60, sets: 4, list: 'setsList4', info: 'totalInfo4', pr: 'pr4', wd: 'weightDisplay4', rd: 'repsDisplay4', hasW: true, step: 1 },
    5: { name: 'Подтягивания прямым хватом', reps: 8, w: 0, sets: 4, list: 'setsList5', info: 'totalInfo5', pr: 'pr5', rd: 'repsDisplay5', hasW: false },
    6: { name: 'Тяга вертикального блока к груди', reps: 12, w: 0, sets: 4, list: 'setsList6', info: 'totalInfo6', pr: 'pr6', rd: 'repsDisplay6', hasW: false }
};

const H = 'workoutHistory';
const P = 'personalRecords';

function getDate() {
    const n = new Date();
    const off = 3 * 60;
    const utc = n.getTime() + n.getTimezoneOffset() * 60000;
    const ms = new Date(utc + off * 60000);
    return ms.toISOString().split('T')[0];
}

function getTime() {
    const n = new Date();
    const off = 3 * 60;
    const utc = n.getTime() + n.getTimezoneOffset() * 60000;
    const ms = new Date(utc + off * 60000);
    return ms.toISOString();
}

function getH() {
    const d = localStorage.getItem(H);
    return d ? JSON.parse(d) : {};
}

function setH(h) {
    localStorage.setItem(H, JSON.stringify(h));
}

function getP() {
    const d = localStorage.getItem(P);
    return d ? JSON.parse(d) : {};
}

function setP(p) {
    localStorage.setItem(P, JSON.stringify(p));
}

function getHist(id) {
    const h = getH();
    return h[id] || [];
}

function saveHist(id, e) {
    const h = getH();
    if (!h[id]) h[id] = [];
    h[id].push(e);
    setH(h);
}

function getPR(id) {
    const p = getP();
    return p[id] || null;
}

function setPR(id, reps, w, date) {
    const e = ex[id];
    const p = getP();
    const d = date || getDate();
    if (e.hasW) {
        p[id] = { reps: reps, w: w, date: d };
    } else {
        p[id] = { reps: reps, date: d };
    }
    setP(p);
    showPR(id);
}

function showPR(id) {
    const e = ex[id];
    const p = getPR(id);
    const el = document.getElementById(e.pr);
    if (p) {
        const d = new Date(p.date + 'T00:00:00+03:00');
        const ds = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Moscow' });
        let t = '🏆 Рекорд: ' + p.reps + ' раз';
        if (e.hasW && p.w && p.w > 0) t += ' × ' + p.w + 'кг';
        t += ' (' + ds + ')';
        el.innerHTML = t;
        el.style.display = 'block';
    } else {
        el.innerHTML = 'Нет рекорда';
        el.style.display = 'block';
    }
}

function chW(id, d) {
    const e = ex[id];
    if (!e.hasW) return;
    e.w = Math.max(0, e.w + d);
    const el = document.getElementById(e.wd);
    if (el) el.textContent = e.w;
}

function chR(id, d) {
    const e = ex[id];
    e.reps = Math.max(1, e.reps + d);
    const el = document.getElementById(e.rd);
    if (el) el.textContent = e.reps;
}

function setPRman(id) {
    const e = ex[id];
    const r = prompt('Введите количество повторений:', e.reps);
    if (r === null) return;
    const reps = parseInt(r);
    if (isNaN(reps) || reps < 1) { alert('Введите корректное число повторений'); return; }
    let w = 0;
    if (e.hasW) {
        const wi = prompt('Введите вес (кг):', e.w);
        if (wi === null) return;
        w = parseInt(wi);
        if (isNaN(w) || w < 0) { alert('Введите корректный вес'); return; }
    }
    const d = getDate();
    setPR(id, reps, w, d);
    let msg = 'Рекорд сохранён!\n' + reps + ' раз';
    if (e.hasW && w > 0) msg += ' × ' + w + ' кг';
    msg += '\nДата: ' + new Date(d + 'T00:00:00+03:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Moscow' });
    alert(msg);
}

function start(id) {
    const e = ex[id];
    if (!e) { alert('Упражнение не найдено'); return; }
    const reps = e.reps;
    const w = e.w;
    const d = getDate();
    const now = getTime();
    const list = document.getElementById(e.list);
    const info = document.getElementById(e.info);
    const num = list.children.length + 1;
    let wt = '';
    if (e.hasW && w > 0) wt = w + 'кг × ';
    const ts = new Date(now).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' });
    const html = '<div class="set-item"><span class="set-number">#' + num + '</span><span class="set-name">' + e.name + '</span><span class="set-reps">' + wt + reps + ' раз</span><span class="set-time">' + ts + '</span></div>';
    list.innerHTML += html;
    const total = list.children.length;
    const rem = e.sets - total;
    let ih = 'Всего подходов: ' + total + ' из ' + e.sets;
    let cls = '';
    if (rem > 0) {
        ih += ' | Осталось: ' + rem;
    } else if (rem === 0) {
        ih += ' | Выполнено!';
        cls = ' done';
        const cur = getPR(id);
        let isNew = false;
        if (!cur) {
            isNew = true;
        } else if (e.hasW) {
            if (reps > cur.reps) isNew = true;
            else if (reps === cur.reps && w > cur.w) isNew = true;
        } else {
            if (reps > cur.reps) isNew = true;
        }
        if (isNew) {
            setPR(id, reps, w, d);
            let msg = '🎉 Новый рекорд!\n' + reps + ' раз';
            if (e.hasW && w > 0) msg += ' × ' + w + ' кг';
            msg += '\nДата: ' + new Date(d + 'T00:00:00+03:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Moscow' });
            alert(msg);
        }
    } else {
        ih += ' | Перевыполнено!';
        cls = ' over';
    }
    info.innerHTML = ih;
    info.className = 'info-display' + cls;
}

function exp() {
    const h = getH();
    const p = getP();
    if (Object.keys(h).length === 0 && Object.keys(p).length === 0) { alert('Нет данных для экспорта'); return; }
    const full = { history: h, records: p, exportDate: getTime() };
    const str = JSON.stringify(full, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout_data_' + getDate() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function imp() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const raw = JSON.parse(event.target.result);
                if (raw.history) setH(raw.history);
                if (raw.records) setP(raw.records);
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

function resetEx(id) {
    const h = getH();
    if (h[id]) { delete h[id]; setH(h); }
    const p = getP();
    if (p[id]) { delete p[id]; setP(p); }
    const e = ex[id];
    const list = document.getElementById(e.list);
    const info = document.getElementById(e.info);
    list.innerHTML = '';
    info.innerHTML = '';
    info.className = 'info-display';
    showPR(id);
    alert('Данные для "' + e.name + '" сброшены');
}

function resetAll() {
    if (confirm('Удалить все данные о тренировках и рекордах?')) {
        localStorage.removeItem(H);
        localStorage.removeItem(P);
        location.reload();
    }
}