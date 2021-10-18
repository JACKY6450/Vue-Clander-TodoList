let app = new Vue({
    el: '#app',
    data:{
        Showdate:[],  //content dfadeout todaycolor
        current: new Date(),
        week: ["日","一","二","三","四","五","六"],
        dateinit: false,
        year_month:{
            year:null,
            month:null
        },
        today:{
            year:null,
            month:null,
            day:null
        },
        todos:[], //isall, isact, iscomplet
        selectall: false,
        pressall: 0,
        visibility: "allitem",
        input: {   
            newTode: '',
            completed :false,
            edittodo: false
        },
        unmodify: true,
        editindex: null,
        modifytodo: {   
            newTode: '',
            completed :false,
            edittodo: false
        },
    },
    computed:{
        checkall:{
            // 設置點擊下方複選框，控制全選按鈕的選種與不選
            // 返回checks每個元素的value值，有一個為false，函數停止執行，全選按鈕狀態為false
            get(){
                return this.todos.every(function(item){
                    return item.completed;
                })
            },
            // checkAll有新的賦值時，新的值會傳到set(value)的value參數中
            // 將新的全選框的值賦值給每個複選款，實現點擊全选和全不選時下方復選框的狀態
            set(value){
                this.todos.forEach(element => {
                    element.completed = value;
                });
            }
        },
        filtertodos(){
            if(this.visibility == "allitem"){
                return this.todos;
            }
            else if(this.visibility == "actitem"){
                return this.todos.filter((item) => {
                    if(!item.completed)
                    return item;
                })
            }
            else if(this.visibility == "completeditem"){
                return this.todos.filter((item) => {
                    if(item.completed)
                    return item;
                })
            }
        },
        uncompletedcount(){
            let count = 0;
            this.todos.forEach((item) => {
                if(!item.completed){
                    count ++;
                }
            })
            return count;
        }
    },
    methods:{
        premonth(){
            this.current.setMonth(this.current.getMonth()-1);
            this.render();
        },
        nextmonth(){
            this.current.setMonth(this.current.getMonth()+1);
            this.render();
        },
        render(){
            //紀錄今天的年月日
            if(!this.dateinit){
                this.today.year = this.current.getFullYear();
                this.today.month = (this.current.getMonth()+1);
                this.today.day = this.current.getDate();
                this.dateinit = true;
            }
            // console.log(this.today);
            //顯示年/月
            this.year_month.year = this.current.getFullYear();
            this.year_month.month = (this.current.getMonth()+1);
            this.Showdate.splice(0, this.Showdate.length);
            // 先取得這個月的第一天
            let firstDate = new Date(this.current.getFullYear(), this.current.getMonth(), 1); 
            // console.log(firstDate);
            // 往前算到星期日
            let date = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
            date.setDate(date.getDate()-date.getDay()); // getDate()回傳幾號 getDay回傳星期幾
            // console.log(date);
            // 畫出上個月的後幾天
            while(date<firstDate){
                this.Showdate.push({
                    content : date.getDate(),
                    dfadeout : true,
                    todaycolor :false
                });
                // 日期 +1
                date.setDate(date.getDate()+1);
            }
            // 畫出這個月的日期
            while(date.getMonth()===this.current.getMonth()){
                if(date.getDate()==this.today.day && date.getMonth()+1==this.today.month && date.getFullYear()==this.today.year){
                    this.Showdate.push({
                        content : date.getDate(),
                        dfadeout : false,
                        todaycolor :true
                    });                    
                }
                else{
                    this.Showdate.push({
                        content : date.getDate(),
                        dfadeout : false,
                        todaycolor :false
                    });
                }
                date.setDate(date.getDate()+1);
            }
            // 畫出下個月的前幾天
            while(date.getDay()>0){
                this.Showdate.push({
                    content : date.getDate(),
                    dfadeout : true,
                    todaycolor :false
                });
                date.setDate(date.getDate()+1);
            }
        },
        addTodo(){ //Vue.js methods 用this可以去抓data:{}裡面的資料
            let datavalue = this.input.newTode;    
            if(!datavalue) return;
            axios.post('http://localhost:3000/todos', this.input)
            .then((res)=>{
                console.log(res);
                this.todos.push(res.data);
                // console.log(this.todos);
            })
            .catch((err)=>{
                console.log(err);
            })  
            // this.todos.push({ //把資料寫進todos[]裡面
            //     content: this.input.newTode,
            //     completed: false,
            // }); 
            this.input.newTode = '';
            if(!this.selectall) this.selectall = true;
            
        },
        removeTode(item){
            let target;
            let tempindex;
            target = this.todos.find((ele, index) => {
                if(ele.newTode === item.newTode){
                    tempindex = index;
                    return{
                        ele 
                    }
                }
            })
            console.log(target, tempindex);
            if (confirm('你確要刪除此項 ?')){
                axios.delete('http://localhost:3000/todos/' +target.id)
                .then((res)=>{
                    console.log(res.data);
                })
                .catch((err)=>{
                    console.log(err);
                })
                
                this.todos.splice(tempindex, 1);
            }
            if(this.todos.length==0){
                this.selectall = false;
            }
        },
        removecomple(){
            for(let i=0;i<this.todos.length;i++){
                if(this.todos[i].completed) break;
                if(i+1==this.todos.length) return;
            }
            if(confirm('你確定要刪除已完成項目 ?')){
                for(let i=0;i<this.todos.length;i++){
                    if(this.todos[i].completed){
                        let target = this.todos[i];
                        axios.delete('http://localhost:3000/todos/' +target.id)
                        .then((res)=>{
                            
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                        this.todos.splice(i, 1);
                        i-=1;
                    }
                }
            }
            if(this.todos.length==0){
                this.selectall = false;
            }
        },
        Show_All(){
            this.visibility = "allitem"; 
            this.pressall = 0;
        },
        Show_Act(){
            this.visibility = "actitem";
            this.pressall = 1;
        },
        Show_Complet(){
            this.visibility = "completeditem";
            this.pressall = 2;
        },
        contmodify(item, index){
            // this.modifycont = true;
            this.unmodify = false;
            item.edittodo = true;
            this.modifytodo.newTode = item.newTode;
            this.editindex = index;
            // this.input.newTode = this.todos[index].newTode;
        },
        modifyconfirm(){
            // this.todos[this.editindex].newTode = this.modifytodo.newTode;
            // this.todos[this.editindex].edittodo = false;
            // this.modifytodo = '';
            let id = this.todos[this.editindex].id;
            // console.log(id);
            axios.put('http://localhost:3000/todos/' + id, this.modifytodo)
            .then((res)=>{
                this.todos.splice(this.editindex,1,res.data)//刪一筆資料寫一筆資料進去
                // this.todos[this.editindex] = res.data;
                this.modifytodo.newTode = '';
                this.editindex = null;
                this.unmodify = true;
            })
            .catch((err)=>{
                console.log(err);
            })
            
        }
    },
    mounted(){
        this.render();
        axios.get('http://localhost:3000/todos')
        .then((res)=>{
            console.log(res);
            this.todos = res.data;
            console.log(this.todos);
            if(this.todos.length>0){
                this.selectall = true;
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})