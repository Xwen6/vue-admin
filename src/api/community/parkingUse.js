import request from '@/utils/request'

export default{
    addParkingSpaceUse(parkingSpaceUse){
        return request({
            url: `/communityService/parkingSpaceUse/add`,
            method: 'post',
            data:parkingSpaceUse
          })
    },

    updateParkingSpaceUse(parkingSpaceUse){
        return request({
            url: `/communityService/parkingSpaceUse/update`,
            method: 'post',
            data:parkingSpaceUse
          })
    },
    


    deleteParkingSpaceUse(id){
        return request({
            url: `/communityService/parkingSpaceUse/delete/${id}`,
            method: 'delete',
          })
    },

    pageList(current,limit,QueryCondition){
        return request({
            url:`/communityService/parkingSpaceUse/pageList/${current}/${limit}`,
            method :"post",
            data: QueryCondition

        })
    },

    getById(id){
        return request({
            url: `/communityService/parkingSpaceUse/getById/${id}`,
            method:"get"
        })
    },
    
    
  
    

}

