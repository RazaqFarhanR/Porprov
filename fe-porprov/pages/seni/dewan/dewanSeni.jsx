import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Timer from '../components/timer'
import { globalState } from '../../../context/context'
import socketIo from 'socket.io-client'
import { useRouter } from 'next/router'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const socket = socketIo (BASE_URL)

const dewanSeni = () => {

    // state data dari local storage
    const [peserta, setPeserta] = useState ([])

    // state
    const [hukum, setHukum] = useState ([])
    const [nilai, setNilai] = useState ([])
    const [nilaiSort, setNilaiSort] = useState ([])
    const [kategori, setKategori] = useState ('')
    const [aktif, setAktif] = useState (0)
    const [median, setMedian] = useState (0)
    const [total, setTotal] = useState (0)
    const [deviasi, setDeviasi] = useState (0)

    const getNilai = async () => {
        //untuk mengambil dari local
        let peserta = JSON.parse (localStorage.getItem ('peserta'))
        let jadwal = (localStorage.getItem ('jadwal'))
        setKategori ((peserta.kategori).toLowerCase())

        let id_peserta = peserta.id
        let id_jadwal = jadwal
        let nilai = []
        let hukum = []

        
        //nilai berdasarkan besar niilai
        if (peserta.kategori == 'tunggal') {
            await axios.get (BASE_URL + `/api/tunggal/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilaiSort (res.data.data)
                nilai = (res.data.data)
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (peserta.kategori == 'ganda') {
            await axios.get (BASE_URL + `/api/ganda/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilaiSort (res.data.data)
                nilai = res.data.data
            })
            .catch (err => {
                console.log(err.response.data.message);
            })
        } else if (peserta.kategori == 'regu') {
            await axios.get (BASE_URL + `/api/regu/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilaiSort (res.data.data)
                nilai = res.data.data
                
            })
            .catch (err => {
                console.log(err.response.data.message);
            })
        } else if (peserta.kategori == 'solo_kreatif') {
            await axios.get (BASE_URL + `/api/solo_kreatif/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilaiSort (res.data.data)
                nilai = res.data.data
            })
            .catch (err => {
                console.log(err.response.data.message);
            })
        } else {
            console.log('gagal');
        }

        //nilai berdasarkan juri
        if (peserta.kategori == 'tunggal') {
            await axios.get (BASE_URL + `/api/tunggal/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilai (res.data.data)
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (peserta.kategori == 'ganda') {
            await axios.get (BASE_URL + `/api/ganda/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilai (res.data.data)
            })
            .catch (err => {
                console.log(err.response.data.message);
            })
        } else if (peserta.kategori == 'regu') {
            await axios.get (BASE_URL + `/api/regu/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilai (res.data.data)
            })
            .catch (err => {
                console.log(err.response.data.message);
            })
        } else if (peserta.kategori == 'solo_kreatif') {
            await axios.get (BASE_URL + `/api/solo_kreatif/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setNilai (res.data.data)
            })
            .catch (err => {
                console.log(err.response.data.message);
            })
        } else {
            console.log('gagal');
        }

        await axios.get (BASE_URL + `/api/hukum/tgr/jadwal/${id_jadwal}/${id_peserta}`)
        .then ((res) => {
            setHukum (res.data.data)
            hukum = (res.data.data)
            // console.log(res.data.data)
            setAktif (hukum.jadwal.aktif)
        })
        .catch ((err) => {
            console.log(err.message);
        })

        // hitung median
        let sort = nilai.sort ((a, b) => a.total_skor - b.total_skor)
        let n1 = sort [4]
        let n2 = sort [5]
        let x1 = n1.total_skor
        let x2 = n2.total_skor
        let median = (x1 + x2)/2
        setMedian (median)

        // hitung skor akhir
        let total = median + hukum.total
        setTotal (total)

        // hitung deviasi
        let arrayNilai = []
        let sum = 0
        for (let i=0; i< nilai.length; i++) {
            let skorA = nilai [i]
            arrayNilai.push (skorA.total_skor)
            sum += arrayNilai [i]
        }
        let deviasi = Math.sqrt (sum/arrayNilai.length) 
        setDeviasi (deviasi)

        // hitung total skor
    }

    const selesai = () => {
        
        const peserta = JSON.parse (localStorage.getItem ('peserta'))
        const jadwal = (localStorage.getItem ('jadwal'))

        let id_peserta = peserta.id
        let id_jadwal = jadwal

        let form = {
            selesai : true,
            median: median,
            skor_akhir: total,
            deviasi: deviasi
        }

        if (confirm('Anda yakin untuk mengakhiri pertandingan?') == 1) {
            axios.put (BASE_URL + `/api/tgr/selesai/${id_jadwal}/${id_peserta}`, form)
            .then (res => {
                window.location = '/seni/dewan/landingPageputra'
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
                console.log(err.response.data.message);

            })
        } else {
            console.log('batal upload data');
        }

    }

    const mulai = () => {
        const jadwal = (localStorage.getItem ('jadwal'))
        let id_jadwal = jadwal

        if (aktif == false) {
            let form = {
                aktif : 1
            }
    
            if (confirm ('Anda yakin untuk memulai pertandingan?') == 1) {
                axios.put (BASE_URL + `/api/tgr/${id_jadwal}`, form)
                .then (res => {
                    socket.emit ('editData')
                    console.log(res.data.message);

                })
                .catch (err => {
                    console.log(err.response.data.message);
                })
            }
        } else if (aktif == true) {
            let form = {
                aktif : 0
            }
    
            if (confirm ('Anda yakin untuk mengakhiri pertandingan?') == 1) {
                axios.put (BASE_URL + `/api/tgr/${id_jadwal}`, form)
                .then (res => {
                    socket.emit ('editData')
                    console.log(res.data.message);
                })
                .catch (err => {
                    console.log(err.response.data.message);
                })
            }
        }

    }

    // delete nilai hukum
    const deleteNilai = (selectedItem) => {
        const peserta = JSON.parse (localStorage.getItem ('peserta'))
        const jadwal = (localStorage.getItem ('jadwal'))

        let id_peserta = peserta.id
        let id_jadwal = jadwal

        if (selectedItem === 'hukum1') {
            let form1 = {
                hukum1 : 0
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, form1) 
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch ((err) => {
                console.log(err.message);
            })
        } else if (selectedItem === 'hukum2') {
            let form2 = {
                hukum2 : 0
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, form2)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch ((err) => {
                console.log(err.message);
            })
        } else if (selectedItem === 'hukum3') {
            let form3 = {
                hukum3 : 0
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, form3)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch ((err) => {
                console.log(err.message);
            })
        } else if (selectedItem === 'hukum4') {
            let form4 = {
                hukum4 : 0
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, form4)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (selectedItem === 'hukum5') {
            let form5 = {
                hukum5 : 0
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, form5)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (selectedItem === 'hukum6') {
            let form6 = {
                hukum6 : 0
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, form6)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        }
    }

    // kurang nilai hukum
    const tambahNilai = (selectedItem) => {

        const peserta = JSON.parse (localStorage.getItem ('peserta'))
        const jadwal = (localStorage.getItem ('jadwal'))

        let id_peserta = peserta.id
        let id_jadwal = jadwal

        if (selectedItem === 'nilai1') {
            let nilai1 = 0
            nilai1 += (hukum.hukum1)

            let formNilai1 = {
                hukum1 : nilai1 + (-0.5)
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, formNilai1) 
            .then (res => {
                console.log(res.data.message);
                socket.emit ('editData')

            })
            .catch ((err) => {
                console.log(err.message);
            })
        } else if (selectedItem === 'nilai2') {
            let nilai2 = 0
            nilai2 += (hukum.hukum2)

            let formNilai2 = {
                hukum2 : nilai2 + (-0.5)
            }
            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, formNilai2)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (selectedItem === 'nilai3') {
            let nilai3 = 0
            nilai3 += (hukum.hukum3)

            let formNilai3 = {
                hukum3 : nilai3 + (-0.5)
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, formNilai3)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (selectedItem === 'nilai4') {
            let nilai4 = 0
            nilai4 += (hukum.hukum4)

            let formNilai4 = {
                hukum4 : nilai4 + (-0.5)
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, formNilai4)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (selectedItem === 'nilai5') {
            let nilai5 = 0
            nilai5 += (hukum.hukum5)

            let formNilai5 = {
                hukum5 : nilai5 + (-0.5)
            }
            axios.put (BASE_URL+ `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, formNilai5)
            .then (res => {
                socket.emit('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (selectedItem === 'nilai6') {
            let nilai6 = 0
            nilai6 += (hukum.hukum6)
            let formNilai6 = {
                hukum6 : nilai6 + (-0.5)
            }

            axios.put (BASE_URL + `/api/hukum/tgr/${id_jadwal}/${id_peserta}`, formNilai6)
            .then (res => {
                socket.emit ('editData')
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        }
    }

    const ubah_data = () => socket.emit ('init_data')

    useEffect (() => {
        return()=>{
        setPeserta (JSON.parse (localStorage.getItem ('peserta')))   
        socket.emit ('init_data')
        socket.on('getData', getNilai)
        socket.on ('change_data', ubah_data)
        // getNilai()
        // ubah_data ()
        // sortNilai()
        }

    }, [])

    const router = useRouter()

    return (
        <>
            <div className="flex ">

                {/* awal konten utama */}
                <div className="w-full overflow-y-auto h-screen"> 
                
                    {/* header */}
                    <Navbar />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="bg-white text-white min-h-full">
                        
                        {/* wrapper keseluruhan */}
                        <div className="w-4/5 mx-auto py-10 space-y-5">

                            {/* wrapper info pesilat & timer */}
                            <div className="flex justify-between">
                                <div className="flex flex-row items-center space-x-2">
                                    {/* button back */}
                                    <button onClick={() => router.back()} className="bg-red-700 hover:bg-red-800 rounded-lg w-14 h-14 my-auto">
                                        <img className='p-3' src="../../../../../../svg/back.svg" />
                                    </button>
                                    {(() => {
                                        if (aktif == true) {
                                            return (
                                                <button onClick={() => mulai()} className="bg-[#54B435] hover:bg-[#379237] py-4 px-8 rounded-lg">
                                                    <span className='text-lg font-semibold'>Sampun Aktif</span>
                                                </button>
                                            )
                                        } else if (aktif == false) {
                                            return (
                                                <button onClick={() => mulai()} className="bg-red-700 hover:bg-red-800 py-4 px-8 rounded-lg">
                                                    <span className='text-lg font-semibold'>Belum Aktif</span>
                                                </button>
                                            )
                                        }
                                    })()}
                                </div>
                                {/* info pesilat */}
                                    <div className="flex flex-row items-center space-x-7 p-2 text-[#2C2F48]">
                                        <div className="flex flex-col">
                                            {(() => {
                                                if (kategori == 'tunggal') {
                                                    return(
                                                        <span className='text-2xl font-semibold'>{peserta.nama1}</span>
                                                    )
                                                } else if (kategori == 'ganda') {
                                                    return (
                                                        <>
                                                            <span className='text-2xl font-semibold'>{peserta.nama1}</span>
                                                            <span className='text-2xl font-semibold'>{peserta.nama2}</span>
                                                        </>
                                                    )
                                                } else if (kategori == 'regu') {
                                                    return (
                                                        <>
                                                            <span className='text-2xl font-semibold'>{peserta.nama1}</span>
                                                            <span className='text-2xl font-semibold'>{peserta.nama2}</span>
                                                            <span className='text-2xl font-semibold'>{peserta.nama3}</span>
                                                        </>
                                                    )
                                                } else if (kategori == 'solo_kreatif') {
                                                    return (
                                                        <>
                                                            <span className='text-2xl font-semibold'>{peserta.nama1}</span>

                                                        </>
                                                    )
                                                }

                                            })()}
                                            <span className='text-lg font-normal text-end'>{peserta.kontingen}</span>
                                        </div>
                                    </div>
                            </div>

                            {/* border skor juri */}
                            <div className="border-2 border-[#2C2F48] p-5 space-y-3 rounded-lg">
                                {/* table skor juri */}
                                <table className='w-full table-fixed border-separate border-spacing-x-2'>
                                    <thead className='bg-[#2C2F48]'>
                                        <tr>
                                            <th colSpan={2} className="border-2 border-[#2C2F48]">Juri</th>
                                            <th className='border-2 border-[#2C2F48]'>1</th>
                                            <th className='border-2 border-[#2C2F48]'>2</th>
                                            <th className='border-2 border-[#2C2F48]'>3</th>
                                            <th className='border-2 border-[#2C2F48]'>4</th>
                                            <th className='border-2 border-[#2C2F48]'>5</th>
                                            <th className='border-2 border-[#2C2F48]'>6</th>
                                            <th className='border-2 border-[#2C2F48]'>7</th>
                                            <th className='border-2 border-[#2C2F48]'>8</th>
                                            <th className='border-2 border-[#2C2F48]'>9</th>
                                            <th className='border-2 border-[#2C2F48]'>10</th>
                                        </tr>
                                    </thead> 
                                    <tbody className='text-center text-[#2C2F48] font-medium'>
                                        {(() => {
                                            if (kategori == 'ganda') {
                                                return (
                                                    <>
                                                        {/* Technique */}
                                                        <tr>
                                                            <>
                                                                <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Teknik</td>
                                                                {nilai.map (item => (
                                                                    <td className='border-2 border-[#2C2F48] text-[#2C2F48]'>
                                                                        <span>{item.technique}</span>
                                                                    </td>
                                                                ))}
                                                            </>
                                                        </tr>
                                                        {/* Firmness */}
                                                        <tr>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Kemantapan</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48] text-black'>
                                                                    <span>{item.firmness}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Soulfulness */}
                                                        <tr>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Ekspresi</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48] text-black'>
                                                                    <span>{item.soulfulness}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Skor */}
                                                        <tr className='bg-[#2C2F48] text-white'>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Total</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48]'>
                                                                    <span>{item.total?.toFixed(2)}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Total skor */}
                                                        <tr className='bg-[#4C4F6D] text-white'>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#4C4F6D]">Total Skor</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#4C4F6D]'>
                                                                    <span>{(item.total_skor).toFixed(2)}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </>
                                                )

                                            } else if (kategori == 'solo_kreatif') {
                                                return (
                                                    <>
                                                        {/* Technique */}
                                                        <tr>
                                                            <>
                                                                <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Teknik</td>
                                                                {nilai.map (item => (
                                                                    <td className='border-2 border-[#2C2F48] text-[#2C2F48]'>
                                                                        <span>{item.technique}</span>
                                                                    </td>
                                                                ))}
                                                            </>
                                                        </tr>
                                                        {/* Firmness */}
                                                        <tr>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Kemantapan</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48] text-black'>
                                                                    <span>{item.firmness}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Soulfulness */}
                                                        <tr>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Ekspresi</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48] text-black'>
                                                                    <span>{item.soulfulness}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Skor */}
                                                        <tr className='bg-[#2C2F48] text-white'>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Total</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48]'>
                                                                    <span>{item.total?.toFixed(2)}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Total skor */}
                                                        <tr className='bg-[#4C4F6D] text-white'>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#4C4F6D]">Total Skor</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#4C4F6D]'>
                                                                    <span>{(item.total_skor).toFixed(2)}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </>
                                                )
                                            } else {
                                                return (
                                                    <>  
                                                        {/* Skor A */}
                                                        <tr>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Skor A</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48]'>
                                                                    <span>
                                                                        {(item.skor_a)?.toFixed(2)}
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Skor B */}
                                                        <tr>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Skor B</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48]'>
                                                                    <span>
                                                                        {(item.skor_b)?.toFixed(2)}
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {/* Total skor */}
                                                        <tr className='bg-[#2C2F48] text-white'>
                                                            <td colSpan={2} className="text-lg font-semibold border-2 border-[#2C2F48]">Total Skor</td>
                                                            {nilai.map (item => (
                                                                <td className='border-2 border-[#2C2F48]'>
                                                                    <span>
                                                                        {(item.total_skor).toFixed(2)}
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </>
                                                )
                                            }
                                        })()}
                                    </tbody>
                                </table>

                                {/* Table urutan juri */}
                                <table className='w-full table-fixed border-separate border-spacing-x-2 font-medium'>
                                    <tbody className='text-center'>
                                            <tr className='bg-[#2C2F48]'>
                                                <th colSpan={2} rowSpan={2} className="text-lg border-2 border-[#2C2F48] ">urutan juri</th>
                                                {nilaiSort.sort ((a,b) => a.total - b.total).map ((item )=> (
                                                    <th>
                                                        {item.juri.no}
                                                    </th>
                                                ))}
                                            </tr>
                                            <tr className='text-[#2C2F48]'>
                                                {nilaiSort.sort ((a,b) => a.total - b.total).map (item => (
                                                    <th className='border-2 border-[#2C2F48]'>{(item.total_skor).toFixed(2)}</th>
                                                ))}
                                            </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* border hukuman */}
                            <div className="border-2 border-[#2C2F48] p-5 space-y-7 rounded-lg">
                                {/* table hukuman */}
                                {(() => {
                                    if ((kategori) == 'tunggal') {
                                        return (
                                            // table tunggal
                                            <table className='w-full table-fixed'>
                                                <thead className='bg-[#2C2F48]'>
                                                    <tr className='text-lg border-2 border-[#2C2F48]'>
                                                        <th className='py-3 w-[55%]'>Hukuman</th>
                                                        <th colSpan={'3'}>Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='font-semibold'>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan melebihi toleransi waktu
                                                            </td>
                                                            {/* button aksi */} 
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1"
                                                                    onClick={() => deleteNilai("hukum1")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                        {(() => {
                                                                            if (hukum.hukum1 === 0) {  
                                                                                return (
                                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai1")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )      
                                                                            } else if (hukum.hukum1 < 0 ) {
                                                                                return (
                                                                                    <button disabled className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai1")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )
                                                                            }
                                                                        })()}
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum1?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan keluar gelanggang 10m x 10m
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum2")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                    onClick={() => tambahNilai("nilai2")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum2?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Menjatuhkan senjata, menyentuh lantai
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" 
                                                                    onClick={() => deleteNilai("hukum3")}
                                                                    >
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai("nilai3")}>
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum3?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>  
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Pakaian tidak sesuai aturan (Tanjak / samping jatuh, atasan - bawahan, samping - tanjak tidak 1 warna)
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum4")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    {(() => {
                                                                            if (hukum.hukum4 === 0) {  
                                                                                return (
                                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai4")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )      
                                                                            } else if (hukum.hukum4 < 0 ) {
                                                                                return (
                                                                                    <button disabled className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai4")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )
                                                                            }
                                                                        })()}
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum4?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>    
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Menahan gerakan lebih dari 5 detik
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" 
                                                                    onClick={() => deleteNilai("hukum5")}
                                                                    >
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai ("nilai5")}>
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum5?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    {/* total nilai */}
                                                    <tr className='bg-[#2C2F48] text-center'>
                                                        <td colSpan={3} className="border-2 border-[#2C2F48] text-lg font-bold">
                                                            <span className='text-xl font-bold tracking-widest'>Total Skor</span>
                                                        </td>
                                                        <td className="border-2 border-[#2C2F48] text-xl font-bold">
                                                            <span className='text-xl font-bold'>
                                                                {hukum.total?.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )
                                    } else if ((kategori) == 'ganda') {
                                        return (
                                            // table tunggal
                                            <table className='w-full table-fixed'>
                                                <thead className='bg-[#2C2F48]'>
                                                    <tr className='text-lg border-2 border-[#2C2F48]'>
                                                        <th className='py-3 w-[55%]'>Hukuman</th>
                                                        <th colSpan={'3'}>Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='font-semibold'>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan melebihi toleransi waktu
                                                            </td>
                                                            {/* button aksi */} 
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1"
                                                                    onClick={() => deleteNilai("hukum1")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                        {(() => {
                                                                            if (hukum.hukum1 === 0) {  
                                                                                return (
                                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai1")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )      
                                                                            } else if (hukum.hukum1 < 0 ) {
                                                                                return (
                                                                                    <button disabled className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai1")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )
                                                                            }
                                                                        })()}
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum1?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan keluar gelanggang 10m x 10m
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum2")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                    onClick={() => tambahNilai("nilai2")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum2?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Senjata jatuh tidak sesuai dengan sinopsis
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" 
                                                                    onClick={() => deleteNilai("hukum3")}
                                                                    >
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai("nilai3")}>
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum3?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>  
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Senjata jatuh diluar gelanggang saat tim masih harus menggunakannya
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum4")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai("nilai4")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                    <span className='text-xl font-bold'>{hukum.hukum4?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>  
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Pakaian tidak sesuai aturan (Atasan - bawahan, samping - tanjak tidak 1 warna)
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum5")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    {(() => {
                                                                            if (hukum.hukum5 === 0) {  
                                                                                return (
                                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai5")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )      
                                                                            } else if (hukum.hukum5 < 0 ) {
                                                                                return (
                                                                                    <button disabled className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai5")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )
                                                                            }
                                                                        })()}
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum5?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>    
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Menahan gerakan lebih dari 5 detik
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" 
                                                                    onClick={() => deleteNilai("hukum6")}
                                                                    >
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai ("nilai6")}>
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum6?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    {/* total nilai */}
                                                    <tr className='bg-[#2C2F48] text-center'>
                                                        <td colSpan={3} className="border-2 border-[#2C2F48] text-lg font-bold">
                                                            <span className='text-xl font-bold tracking-widest'>Total Skor</span>
                                                        </td>
                                                        <td className="border-2 border-[#2C2F48] text-xl font-bold">
                                                            <span className='text-xl font-bold'>
                                                                {hukum.total?.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </table>
                                        )
                                    } else if (kategori == 'solo_kreatif') {
                                        return (
                                            <table className='w-full table-fixed'>
                                                <thead className='bg-[#2C2F48]'>
                                                    <tr className='text-lg border-2 border-[#2C2F48]'>
                                                        <th className='py-3 w-[55%]'>Hukuman</th>
                                                        <th colSpan={'3'}>Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='font-semibold'>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan keluar gelanggang 10m x 10m
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum1")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                    onClick={() => tambahNilai("nilai1")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum1?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Senjata tidak sesuai sinopsis
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum2")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                    onClick={() => tambahNilai("nilai2")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum2?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>    
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Senjata jatuh keluar gelanggang saat tim masih harus menggunakannya
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" 
                                                                    onClick={() => deleteNilai("hukum3")}
                                                                    >
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai ("nilai3")}>
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum3?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    {/* total nilai */}
                                                    <tr className='bg-[#2C2F48] text-center'>
                                                        <td colSpan={3} className="border-2 border-[#2C2F48] text-lg font-bold">
                                                            <span className='text-xl font-bold tracking-widest'>Total Skor</span>
                                                        </td>
                                                        <td className="border-2 border-[#2C2F48] text-xl font-bold">
                                                            <span className='text-xl font-bold'>
                                                                {hukum.total?.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )                                    
                                    } else if ((kategori) == 'regu') {
                                        return (
                                            // table regu
                                            <table className='w-full table-fixed'>
                                                <thead className='bg-[#2C2F48]'>
                                                    <tr className='text-lg border-2 border-[#2C2F48]'>
                                                        <th className='py-3 w-[55%]'>Hukuman</th>
                                                        <th colSpan={'3'}>Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='font-semibold'>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan melebihi toleransi waktu
                                                            </td>
                                                            {/* button aksi */} 
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1"
                                                                    onClick={() => deleteNilai("hukum1")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    {(() => {
                                                                        if (hukum.hukum1 === 0) {  
                                                                            return (
                                                                                <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                onClick={() => tambahNilai("nilai1")}
                                                                                >
                                                                                    <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                </button>
                                                                            )      
                                                                        } else if (hukum.hukum1 < 0 ) {
                                                                            return (
                                                                                <button disabled className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                onClick={() => tambahNilai("nilai1")}
                                                                                >
                                                                                    <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                </button>
                                                                            )
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum1?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan keluar gelanggang 10m x 10m
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum2")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                    onClick={() => tambahNilai("nilai2")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum2?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>  
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Pakaian tidak sesuai persyaratan (Sabuk putih jatuh)
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum3")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    {(() => {
                                                                            if (hukum.hukum3 === 0) {  
                                                                                return (
                                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai3")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )      
                                                                            } else if (hukum.hukum3 < 0 ) {
                                                                                return (
                                                                                    <button disabled className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                                    onClick={() => tambahNilai("nilai3")}
                                                                                    >
                                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                                    </button>
                                                                                )
                                                                            }
                                                                        })()}
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum3?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>    
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Menahan gerakan lebih dari 5 detik
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" 
                                                                    onClick={() => deleteNilai("hukum4")}
                                                                    >
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai ("nilai4")}>
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum4?.toFixed(2)}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    {/* total nilai */}
                                                    <tr className='bg-[#2C2F48] text-center'>
                                                        <td colSpan={3} className="border-2 border-[#2C2F48] text-lg font-bold">
                                                            <span className='text-xl font-bold tracking-widest'>Total Skor</span>
                                                        </td>
                                                        <td className="border-2 border-[#2C2F48] text-xl font-bold">
                                                            <span className='text-xl font-bold'>
                                                                {hukum.total?.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )
                                    } else if (kategori == 'solo_kreatif') {
                                        return (
                                            <table className='w-full table-fixed'>
                                                <thead className='bg-[#2C2F48]'>
                                                    <tr className='text-lg border-2 border-[#2C2F48]'>
                                                        <th className='py-3 w-[55%]'>Hukuman</th>
                                                        <th colSpan={'3'}>Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='font-semibold'>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Penampilan keluar gelanggang 10m x 10m
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum1")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                    onClick={() => tambahNilai("nilai1")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum1}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>         
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Senjata tidak sesuai sinopsis
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" onClick={() => deleteNilai("hukum2")}>
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" 
                                                                    onClick={() => tambahNilai("nilai2")}
                                                                    >
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum2}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    <tr>
                                                        <>    
                                                            {/* nama hukuman */}
                                                            <td className='border-2 border-[#2C2F48] p-4 text-[#2C2F48]'>
                                                                Senjata jatuh keluar gelanggang saat tim masih harus menggunakannya
                                                            </td>
                                                            {/* button aksi */}
                                                            <td colSpan={2} className='border-2 border-[#2C2F48]'>
                                                                <div className="flex space-x-5 justify-center items-center">
                                                                    <button className="bg-blue-700 hover:bg-[#253EA3] rounded-lg px-10 py-1" 
                                                                    onClick={() => deleteNilai("hukum3")}
                                                                    >
                                                                        <span className='text-xl font-semibold'>Hapus</span>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 px-10 rounded-lg py-1" onClick={() => tambahNilai ("nilai3")}>
                                                                        <span className='text-xl font-semibold tracking-widest'>-0,5</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className='border-2 text-red-700 text-center border-[#2C2F48]'>
                                                                <span className='text-xl font-bold'>{hukum.hukum3}</span>
                                                            </td>
                                                        </>
                                                    </tr>
                                                    {/* total nilai */}
                                                    <tr className='bg-[#2C2F48] text-center'>
                                                        <td colSpan={3} className="border-2 border-[#2C2F48] text-lg font-bold">
                                                            <span className='text-xl font-bold tracking-widest'>Total Skor</span>
                                                        </td>
                                                        <td className="border-2 border-[#2C2F48] text-xl font-bold">
                                                            <span className='text-xl font-bold'>
                                                                {hukum.total?.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )                                
                                    }
                                })()}
                            </div>
                            {/* Skor akhir */}
                            {/* wrapper waktu & hukuman */}
                            <div className="grid grid-cols-12 px-2 gap-x-2">
                                {/* waktu & median */}
                                {/* Waktu */}
                                <div className='col-span-2'>
                                    <div className="bg-[#2C2F48] py-1 px-4 w-full flex justify-center">
                                        <span className='text-2xl font-semibold'>Waktu</span>
                                    </div>
                                    <div className="text-[#2C2F48] py-1 px-4 w-full flex justify-center border-2 border-[#2C2F48]">
                                        <span className='text-4xl font-bold'>03.00</span>
                                    </div>
                                </div>
                                {/* median */}
                                <div className='col-span-2'>
                                    <div className="bg-[#2C2F48] py-1 px-4 w-full flex justify-center">
                                        <span className='text-2xl font-semibold'>Median</span>
                                    </div>
                                    <div className="text-[#2C2F48] py-1 px-4 w-full flex justify-center border-2 border-[#2C2F48]">
                                        <span className='text-4xl font-bold'>{median?.toFixed(2)}</span>
                                    </div>
                                </div>
                                {/* skor akhir */}
                                <div className='col-span-8'>
                                    <div className="grid grid-rows-2 text-center gap-y-2 px-2 h-full">
                                        <div className="grid grid-cols-2 gap-x-4 items-center justify-center">
                                            <span className='text-xl font-semibold rounded-lg bg-[#2C2F48] py-2'>Skor Akhir</span>
                                            <span className='text-xl font-semibold rounded-lg bg-white text-black border-2 border-[#2C2F48]'>{total.toFixed(2)}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 items-center justify-center">
                                            <span className='text-xl font-semibold rounded-lg bg-[#2C2F48] py-2'>Standart Deviasi</span>
                                            <span className='text-xl font-semibold rounded-lg bg-white text-black border-2 border-[#2C2F48]'>{deviasi}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="bg-yellow-500 text-center text-2xl font-bold py-2 rounded-lg w-full" onClick={() => selesai()}>
                                <span>Selesai</span>
                            </button>

                        </div>
                    </div>
                    <Footer />
                </div>
                {/* akhir konten utama */}
            </div>
        </>

    )
}

export default dewanSeni