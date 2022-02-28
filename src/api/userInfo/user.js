import request from '@/utils/request'

export default{
    addUserInfo(userInfo){
        return request({
            url: `/userService/userInfo/addUserInfo`,
            method: 'post',
            data:userInfo
          })
    },

    updateUserInfo(userInfo){
        return request({
            url: `/userService/userInfo/updateUserInfo/`,
            method: 'post',
            data:userInfo
          })
    },
    


    deleteUserInfo(id){
        return request({
            url: `/userService/userInfo/deleteUserInfo/${id}`,
            method: 'delete',
          })
    },

    getUserInfoList(current,limit,userInfoQuery){
        return request({
            url:`/userService/userInfo/pageList/${current}/${limit}`,
            method :"post",
            data: userInfoQuery

        })
    },

    getUserInfoById(id){
        return request({
            url: `/userService/userInfo/getUserInfoById/${id}`,
            method:"get"
        })
    }
  
    

}

