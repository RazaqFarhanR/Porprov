const models = require("../../models/index.js")
const Tanding = models.jadwal_tanding
const fs = require("fs");
const readline = require("readline");
const { parse } = require("csv-parse");
const {v4 : uuidv4} = require('uuid')
const { 
    getResponse, 
    addResponse, 
    editResponse, 
    deleteResponse, 
    errorResponse 
} = require("../../helpers");

module.exports = {
    getAll: async (req,res)=>{
        try{
            const tanding = await Tanding.findAll({
                attributes:{
                    exclude:['createAt','updateAt']
                }
            })
            return getResponse( req, res, tanding )
        } catch (error) {
            return errorResponse( req, res, error.message )
        }
    },
    getId: async (req,res)=>{
        try{
            let param = {id: req.params.id}
            const tanding = await Tanding.findOne({
                where:param,
                attributes:{
                    exclude:['createAt','updateAt']
                }
            })
            return getResponse( req, res, tanding )
        } catch (error) {
            return errorResponse( req, res, error.message )
        }
    },
    importCsv: async (req, res)=>{
        try{
            let file = "src/tmp/tanding.csv"
            const id = uuidv4()
            let current = new Date().toISOString().split('T')[0]
            const stream = fs.createReadStream(file);
            const reader = readline.createInterface({ input: stream });

            let data = [];

            stream
            .pipe(parse({ delimiter: ",", from_line: 1 }))
            .on("data", function (row) {
            // 👇 split a row string into an array
            // then push into the data array
            data.push(row)

            });

            reader.on("close", async () => {
                // 👇 reached the end of file
                for (var i=0; i < data.length; i++){
                    let tanding = data[i]

                    let input = {
                        id: uuidv4(),
                        tgl: current,
                        kelas: tanding[1],                    
                        gelanggang: tanding[2],
                        partai: tanding[3],
                        nm_merah: tanding[4],
                        kontingen_merah: tanding[5],
                        nm_biru: tanding[6],
                        kontingen_biru: tanding[7],
                        babak: tanding[8],
                    }

                    const result = await Tanding.create(input)
                }
                fs.unlink(file, (err) => console.log(err))
                return addResponse( req, res )
                // data.forEach(element => {
                //     element.id = uuidv4(),
                //     element.tgl = current
                // }) 
            });

        } catch (error){
            return errorResponse( req, res, error.message )
        }
    },

    addTanding: async (req, res)=>{
        try{
            let current = new Date().toISOString().split('T')[0]
            const id = uuidv4()
            let data = {
                id: id,
                tgl: current,
                waktu: req.body.waktu,
                kelas: req.body.kelas,
                gelanggang: req.body.gelanggang,
                partai: req.body.partai,
                nm_merah: req.body.nm_merah,
                kontingen_merah: req.body.kontingen_merah,
                nm_biru: req.body.nm_biru,
                kontingen_biru: req.body.kontingen_biru,
                babak: req.body.babak,
                status: true
            }
            const result = await Tanding.create(data)
            return addResponse( req, res, result)
        } catch (error) {
            return errorResponse( req, res, error.message )
        }
    },
    editTanding: async (req,res)=>{
        try{
            let param = {id: req.params.id}
            let data = {
                waktu: req.body.waktu,
                kelas: req.body.kelas,
                gelanggang: req.body.gelanggang,
                partai: req.body.partai,
                nm_merah: req.body.nm_merah,
                kontingen_merah: req.body.kontingen_merah,
                nm_biru: req.body.nm_biru,
                kontingen_biru: req.body.kontingen_biru,
                babak: req.body.babak,
            }
            const result = await Tanding.update(data, {where: param})
            return editResponse(req, res, result)
        } catch (error) {
            return errorResponse(req, res, error.message)
        }
    },
    deleteTandingbyId: async (req,res)=>{
        try{
            let param = {id: req.params.id}
            const result = await Tanding.destroy({where: param})
            return deleteResponse( req,res, result)
        } catch (error){
            return errorResponse( req, res, error.message )
        }
    },
    deleteAllTanding: async (req,res)=>{
        try{
            const data = await Tanding.count()
            const result = await Tanding.destroy({truncate: true})
            return deleteResponse( req,res, data )
        } catch (error){
            return errorResponse( req, res, error.message )
        }
    }
}