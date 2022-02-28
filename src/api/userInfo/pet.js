import request from '@/utils/request'

export default{
    addPet(Pet){
        return request({
            url: `/userService/Pet/addPet`,
            method: 'put',
            data:Pet
          })
    },

    updatePet(Pet){
        return request({
            url: `/userService/Pet/update/`,
            method: 'post',
            data:Pet
          })
    },
    


    deletePet(id){
        return request({
            url: `/userService/Pet/delete/${id}`,
            method: 'delete',
          })
    },

    getPetList(current,limit,PetQuery){
        return request({
            url:`/userService/Pet/pageList/${current}/${limit}`,
            method :"post",
            data: PetQuery

        })
    },

    getPetById(id){
        return request({
            url: `/userService/Pet/getPetById/${id}`,
            method:"get"
        })
    },

    batchDelete(ids){
        return request({
            url:`/userService/Pet/batchDelete`,
            method:"delete",
            data:ids
        })
    }
  
    

}

