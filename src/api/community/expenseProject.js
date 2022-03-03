import request from '@/utils/request'

export default{
    addExpensesProject(esExpensesProject){
        return request({
            url: `/communityService/expensesProject/add`,
            method: 'post',
            data:esExpensesProject
          })
    },

    updateExpensesProject(esExpensesProject){
        return request({
            url: `/communityService/expensesProject/updateById`,
            method: 'post',
            data:esExpensesProject
          })
    },
    


    deleteById(id){
        return request({
            url: `/communityService/expensesProject/deleteById/${id}`,
            method: 'delete',
          })
    },

    pageList(current,limit,ExpenseProjectQuery){
        return request({
            url:`/communityService/expensesProject/pageList/${current}/${limit}`,
            method :"post",
            data: ExpenseProjectQuery

        })
    },

    getById(id){
        return request({
            url: `/communityService/expensesProject/getById/${id}`,
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

