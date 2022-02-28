import request from '@/utils/request'

export default{
    addParkingSpace(parkingSpace){
        return request({
            url: `/communityService/parkingSpace/addParkingSpace`,
            method: 'post',
            data:parkingSpace
          })
    },

    updateParkingSpace(parkingSpace){
        return request({
            url: `/communityService/parkingSpace/updateParkingSpace`,
            method: 'post',
            data:parkingSpace
          })
    },
    


    deleteParkingSpace(code){
        return request({
            url: `/communityService/parkingSpace/deleteParkingSpace/${code}`,
            method: 'delete',
          })
    },

    pageList(current,limit,QueryCondition){
        return request({
            url:`/communityService/parkingSpace/pageList/${current}/${limit}`,
            method :"post",
            data: QueryCondition

        })
    },

    getParkingSpaceByCode(code){
        return request({
            url: `/communityService/parkingSpace/getParkingSpaceByCode/${code}`,
            method:"get"
        })
    },
    changeStatus(id,status){
        return request({
            url: `/communityService/parkingSpace/changeStatus/${id}/${status}`,
            method:"post"
        })
    }
  
    

}

