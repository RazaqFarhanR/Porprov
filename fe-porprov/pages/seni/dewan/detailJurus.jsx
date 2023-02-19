import React, { useEffect, useState, useRef, use } from 'react'
import { useReactToPrint } from 'react-to-print'
import Link from 'next/link'
import axios from 'axios'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { useRouter } from 'next/router'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const detailJurus = () => {
    
    const router = useRouter ()

    // untuk print
    const componentRef = useRef ()
    const handlePrint = useReactToPrint ({
        content : () => componentRef.current,
        documentTitle : 'test',
        onAfterPrint : () => alert (`print berhasil`)
    })

    // ini State
    const [data, setData] = useState ([])
    const [dataRegu, setDataRegu] = useState ([])
    const [peserta, setPeserta] = useState ([])
    const [jadwal, setJadwal] = useState ([])

    const getNilai = () => {
        const peserta = JSON.parse (localStorage.getItem ('peserta'))
        const jadwal = JSON.parse (localStorage.getItem ('jadwal'))

        setPeserta (peserta)
        setJadwal (jadwal)

        let id_peserta = peserta.id
        let id_jadwal = jadwal.id
        
        if (peserta.kategori == 'tunggal') {
            axios.get (BASE_URL + `/api/tunggal/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setData (res.data.data)
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (peserta.kategori == 'regu') {
            axios.get (BASE_URL + `/api/regu/jadwal/${id_jadwal}/${id_peserta}`)
            .then (res => {
                setDataRegu (res.data.data)
            })
            .catch (err => {
                console.log(err.message);
            })
        }
    }

    const isLogged = () => {
        if (localStorage.getItem ('token') === null || localStorage.getItem ('dewan') === null) {
         router.push ('/seni/dewan/login') 
        }
    }

    useEffect (() => {
        getNilai ()
        isLogged ()
    }, [])

    return (
        <>
        <div ref={componentRef} className="flex ">

            {/* awal konten utama */}
            <div className="w-full overflow-y-auto h-screen"> 
            
                {/* header */}
                <Navbar />
                {/* akhir header */}

                {/* konten utama */}
                <div className="bg-white text-white min-h-full">
                    {/* wrapper keseluruhan */}
                    <div className="w-11/12 mx-auto py-10 space-y-6">
                        {/* wrapper information */}
                        <div className="grid grid-cols-12 gap-x-5">
                            {/* button back */}
                            <button onClick={() => router.back ()} className="bg-red-700 rounded-lg w-12 h-12 my-auto">
                                <img className='p-3' src="../../../../../../svg/back.svg" />
                            </button>
                            {/* pesilat information */}
                            <div className={peserta.id == jadwal.id_biru ? "col-span-9 py-2 bg-blue-600 rounded-lg flex flex-col" : "col-span-9 py-2 bg-red-600 rounded-lg flex flex-col"}>
                                {(() => {
                                    if (peserta.kategori == 'tunggal') {
                                        return (
                                            <span className='text-lg font-semibold px-4 tracking-wide'>{peserta.nama1}</span>
                                        )
                                    } else if (peserta.kategori == 'regu') {
                                        return (
                                            <>
                                                <span className='text-lg font-semibold px-4 tracking-wide'>{peserta.nama1} - {peserta.nama2} - {peserta.nama3}</span>
                                            </>
                                        )
                                    }
                                })()}
                                <span className='font-semibold tracking-wider px-4'>{peserta.kontingen}</span>
                            </div>
                            {/* pertandingan information */}
                            <div className={peserta.id == jadwal.id_biru ? "col-span-2 py-2 bg-blue-600 rounded-lg flex flex-col text-center" : "col-span-2 py-2 bg-red-600 rounded-lg flex flex-col text-center"}>
                                <span className='text-lg font-semibold px-4 tracking-wide'>Penyisihan</span>
                                <span className='font-semibold tracking-wider px-4 uppercase'>{(peserta.kategori)} - {peserta.jk}</span>
                            </div>
                        </div>
                        {/* table detail jurus */}
                        {(() => {
                            if (peserta.kategori == 'tunggal') {
                                return (
                                    <table className='w-full table-fixed'>
                                        <thead>
                                            <tr className='bg-[#222954] border-2 border-[#c9c9c9]'>
                                                <th className='py-2'>Juri</th>
                                                <th className='border-2 border-[#c9c9c9]'>1</th>
                                                <th className='border-2 border-[#c9c9c9]'>2</th>
                                                <th className='border-2 border-[#c9c9c9]'>3</th>
                                                <th className='border-2 border-[#c9c9c9]'>4</th>
                                                <th className='border-2 border-[#c9c9c9]'>5</th>
                                                <th className='border-2 border-[#c9c9c9]'>6</th>
                                                <th className='border-2 border-[#c9c9c9]'>7</th>
                                                <th className='border-2 border-[#c9c9c9]'>8</th>
                                                <th className='border-2 border-[#c9c9c9]'>9</th>
                                                <th className='border-2 border-[#c9c9c9]'>10</th>
                                                <th className='border-2 border-[#c9c9c9]'>11</th>
                                                <th className='border-2 border-[#c9c9c9]'>12</th>
                                                <th className='border-2 border-[#c9c9c9]'>13</th>
                                                <th className='border-2 border-[#c9c9c9]'>14</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map ((item, index) => (
                                                <tr key={index + 1} className='text-[#222954] text-center text-lg font-semibold'>
                                                    <td className='border-2 border-[#c9c9c9] bg-[#222954] text-white'>{item.juri.no}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus1) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus2) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus3) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus4) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus5) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus6) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus7) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus8) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus9) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus10) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus11) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus12) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus13) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus14) / (-0.01)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            } else if (peserta.kategori == 'regu') {
                                return (
                                    <table className='w-full table-fixed'>
                                        <thead>
                                            <tr className='bg-[#222954] border-2 border-[#c9c9c9]'>
                                                <th className='py-2'>Juri</th>
                                                <th className='border-2 border-[#c9c9c9]'>1</th>
                                                <th className='border-2 border-[#c9c9c9]'>2</th>
                                                <th className='border-2 border-[#c9c9c9]'>3</th>
                                                <th className='border-2 border-[#c9c9c9]'>4</th>
                                                <th className='border-2 border-[#c9c9c9]'>5</th>
                                                <th className='border-2 border-[#c9c9c9]'>6</th>
                                                <th className='border-2 border-[#c9c9c9]'>7</th>
                                                <th className='border-2 border-[#c9c9c9]'>8</th>
                                                <th className='border-2 border-[#c9c9c9]'>9</th>
                                                <th className='border-2 border-[#c9c9c9]'>10</th>
                                                <th className='border-2 border-[#c9c9c9]'>11</th>
                                                <th className='border-2 border-[#c9c9c9]'>12</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataRegu.map ((item, index) => (
                                                <tr key={index + 1} className='text-[#222954] text-center text-lg font-semibold'>
                                                    <td className='border-2 border-[#c9c9c9] bg-[#222954] text-white'>{item.juri.no}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus1) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus2) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus3) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus4) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus5) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus6) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus7) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus8) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus9) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus10) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus11) / (-0.01)}</td>
                                                    <td className='border-2 border-[#c9c9c9]'>{(item.jurus12) / (-0.01)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            }
                        })()}
                    </div>
                </div>
                <Footer />
            </div>
            {/* akhir konten utama */}
        </div>
    </>

    )
}

export default detailJurus