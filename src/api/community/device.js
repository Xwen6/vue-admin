import request from '@/utils/request'

export default{
    addDevice(device){
        return request({
            url: `/communityService/device/addDevice`,
            method: 'post',
            data:device
          })
    },

    updateDevice(device){
        return request({
            url: `/communityService/device/updateDevice`,
            method: 'post',
            data:device
          })
    },
    


    deleteById(id){
        return request({
            url: `/communityService/device/deleteById/${id}`,
            method: 'delete',
          })
    },

    pageList(current,limit,DeviceQuery){
        return request({
            url:`/communityService/device/pageList/${current}/${limit}`,
            method :"post",
            data: DeviceQuery

        })
    },

    getById(id){
        return request({
            url: `/communityService/device/getById/${id}`,
            method:"get"
        })
    },
    getCommunityList(){
        return request({
            url: `/communityService/community/getCommunityList`,
            method:"get"
        })
    }
  
    

}

