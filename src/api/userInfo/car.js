import request from '@/utils/request'

export default{
    addCar(vehicle){
        return request({
            url: `/userService/Car/addCar`,
            method: 'put',
            data:vehicle
          })
    },

    updateCar(vehicle){
        return request({
            url: `/userService/Car/update/`,
            method: 'post',
            data:vehicle
          })
    },
    


    deleteCar(id){
        return request({
            url: `/userService/Car/deleteById/${id}`,
            method: 'delete',
          })
    },

    getCarList(current,limit,vehicleQUery){
        return request({
            url:`/userService/Car/pageList/${current}/${limit}`,
            method :"post",
            data: vehicleQUery

        })
    },

    getCarById(id){
        return request({
            url: `/userService/Car/getById/${id}`,
            method:"get"
        })
    }
  
    

}

