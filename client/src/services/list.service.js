import httpService from "./http.service";

const urlTasksEndpoint = `lists/`

export const listsService = {
  async getLists() {
    const {data} = await httpService.get(urlTasksEndpoint)
    return data
  },
  async addList(newList) {
    const {data} = await httpService.post(urlTasksEndpoint, newList)
    return data
  },
  async removeList(id) {
    return await httpService.delete(urlTasksEndpoint + id)
  },
  async editTitle(listId, newTitle) {
    const {data} = await httpService.patch(urlTasksEndpoint + listId, {
      name: newTitle
    })
    return data
  }
}
