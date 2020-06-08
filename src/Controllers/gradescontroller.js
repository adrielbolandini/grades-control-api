const express = require('express');
const fs = require('fs');



module.exports = {
    grades(_,res){
        try{
            fs.readFile('./grades.json', async (err,data)=>{
                if (err) throw err;
                data = await JSON.parse(data);
                res.send(data);
            });}catch{
                res.send(err);
            }
    },

    newgrade(req,res){
        let params = req.body;
        fs.readFile('./grades.json', async(err,data)=>{
            try{
                let date = new Date();
                params.timestamp = date;
                let newgradeobject = params;
                let datajson = await JSON.parse(data);
                params = {id: datajson.nextId++, ...params};
                datajson.grades.push(params);

                fs.writeFile('./grades.json', JSON.stringify(datajson), err=>{
                    (err) ? res.status(400).send("Erro ao grava o arquivo") : res.status(201).send(newgradeobject);
                })
            }catch{
                res.send(err);
            }
        });
    },

    updategrade(req,res){
        let id = parseInt(req.params.id);
        let params = {"id" : id,...req.body};
        fs.readFile('./grades.json', async(err,data)=>{
            try{
                let date = new Date();
                params.timestamp = date;
                let newgradeobject = params;
                let datajson = await JSON.parse(data);
                let index= datajson.grades.findIndex(e=>e.id==id);
                datajson.grades[index] = params;
                if (index ==-1){
                    res.status(400).send('ID não encontrada');
                    return true;
                };

                fs.writeFile('./grades.json', JSON.stringify(datajson), err=>{
                    (err) ? res.status(400).send("Erro ao atualizar o dado") : res.status(201).send(newgradeobject);
                })
            }catch{
                res.send(err);
            }
        });
    },

    deletegrade(req,res){
        let id = parseInt(req.params.id);
        fs.readFile('./grades.json', async(err,data)=>{
            try{
                let datajson = await JSON.parse(data);
                let index= datajson.grades.findIndex(e=>e.id==id);
                if (index ==-1){
                    res.status(400).send('ID não encontrada');
                    return true;
                };
                datajson.grades = datajson.grades.filter((e)=>{
                    return e.id != id;
                });

                fs.writeFile('./grades.json', JSON.stringify(datajson), err=>{
                    (err) ? res.status(400).send("Erro ao atualizar o dado") : res.status(200).send("Objeto deletado");
                })
            }catch{
                res.send(err);
            }
        });
    },

    specificgrade(req,res){
        let id = parseInt(req.params.id);
        fs.readFile('./grades.json', async(err,data)=>{
            try{
                let datajson = await JSON.parse(data);
                let index= datajson.grades.findIndex(e=>e.id==id);
                if (index ==-1){
                    res.status(400).send('ID não encontrada');
                    return true;
                };
                datajson = datajson.grades.filter((e)=>{
                    return e.id == id;
                });
                
                res.status(200).send(datajson);
            }catch{
                res.send(err);
            }
        });
    },

    totalgrade(req,res){
        let params = req.body;
        fs.readFile('./grades.json', async(err,data)=>{
            try{
                let datajson = await JSON.parse(data);
                datajson = datajson.grades.filter((e)=>{
                    return (e.student == params.student && e.subject == params.subject);
                })
                .map(el=>{
                    return el=el.value;  
                })
                .reduce((prev,acc)=>{
                    return prev+acc;
                },0);

                res.status(200).send(`${datajson}`);
            }catch{
                res.send(err);
            }
        });
    },

    meangrade(req,res){
        let params = req.body;
        fs.readFile('./grades.json', async(err,data)=>{
            try{
                let datajson = await JSON.parse(data);
                datajson = datajson.grades.filter((e)=>{
                    return (e.type == params.type && e.subject == params.subject);
                })
                .map(el=>{
                    return el=el.value;  
                });
                let div = datajson.length;
                if (div ==0) div=1;
                let mean = datajson.reduce((prev,acc)=>{
                    return (acc+prev);
                })/div;


                res.status(200).send(`${mean}`);
            }catch{
                res.send(err);
            }
        });
    },

    bestgrade(req,res){
        let params = req.body;
        fs.readFile('./grades.json', async(err,data)=>{
            try{
                let datajson = await JSON.parse(data);
                datajson = datajson.grades.filter((e)=>{
                    return (e.type == params.type || e.subject == params.subject);
                }).map(e=>{
                    return e=e.value;
                })
                .sort((a,b)=>{
                    return b-a;
                })
                .slice(0,3);

                res.status(200).send(datajson);
            }catch{
                res.send(err);
            }
        });
    }
};