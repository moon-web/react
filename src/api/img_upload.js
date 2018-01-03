export default {
    upload(file,obj,file_path){
        if(file){
            const formdata = new FormData();
            formdata.append("file",file);
            fetch("//api.df-house.com/api/v1/upload",{
                method:"post",
                body:formdata,
            }).then(
                (res)=> {
                    return res.json();
                }
            ).then(
                (res)=>{
                    file_path?obj.upload_complete(res.access_url,file_path,file):obj.upload_complete(res.access_url,file);
                }
            )
        }
    }
}