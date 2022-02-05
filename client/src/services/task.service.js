import httpService from "./http.service";

const urlTasksEndpoint = `tasks/`

export const tasksService = {
    async getTasks() {
        const {data} = await httpService.get(urlTasksEndpoint)
        return data
    },
    async addTask(objTask){
        const {data} = await httpService.post(urlTasksEndpoint, objTask)
        return data
    },
    async removeTask(taskId, newTasks) {
        if (newTasks) {
            const {data} = await httpService.post(urlTasksEndpoint, ...newTasks)
            return data
        } else {
            return await httpService.delete(urlTasksEndpoint + taskId)
        }
    },
    async editTask (taskId, obj) {
        const {status} = await httpService.patch(urlTasksEndpoint + taskId, obj)
        return status
    },
}