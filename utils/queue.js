const config = require("./config");

let apiTasks = [];
let lastId = 0;

// task - function to be called to process task (promise)
// cb - function to be called after task is done
function addApiTask(task, cb) {
  const id = lastId + 1;
  apiTasks.push({
    task,
    cb,
    id,
  });
  lastId = id;
  return id;
}

function removeTask(id) {
  apiTasks = apiTasks.filter((task) => task.id !== id);
}

async function executeNextTask() {
  let finished = apiTasks.length < 1;
  while (!finished) {
    let nextTask = apiTasks.shift();
    if (!nextTask) continue;
    try {
      const result = await nextTask.task();
      nextTask.cb(result);
    } catch (_) {
      nextTask.cb(null);
    }
    finished = true;
  }
}

setInterval(executeNextTask, config.apiRate);

module.exports = {
  addApiTask,
  removeTask,
};
