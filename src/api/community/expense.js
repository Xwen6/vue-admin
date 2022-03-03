import request from '@/utils/request'

export default{
    add(expenses){
        return request({
            url: `/communityService/Expenses/add`,
            method: 'post',
            data:expenses
          })
    },

    updateExpenses(expenses){
        return request({
            url: `/communityService/Expenses/update`,
            method: 'post',
            data:expenses
          })
    },
    


    deleteById(id){
        return request({
            url: `/communityService/Expenses/deleteById/${id}`,
            method: 'delete',
          })
    },

    pageList(current,limit,ExpenseQuery){
        return request({
            url:`/communityService/Expenses/pageList/${current}/${limit}`,
            method :"post",
            data: ExpenseQuery

        })
    },

    getById(id){
        return request({
            url: `/communityService/Expenses/getById/${id}`,
            method:"get"
        })
    },
    getSelectList(){
        return request({
            url: `/communityService/Expenses/getSelectList`,
            method:"get"
        })
    }
  
    

}

