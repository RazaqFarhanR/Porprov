import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/sidebar'
import Navbar from './components/navbar'
import Footer from './components/footer'
import ModalEvent from './components/modalEvent'
import ModalDelete from './components/modalDelete'
import { globalState } from '../../context/context'
import { useRouter } from 'next/router'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const webSetting = () => {

    const router = useRouter ()

    // ini state
    const [event, setEvent] = useState ([])
    const [action, setAction] = useState ('')
    const [nama, setNama] = useState ('')
    const [id, setId] = useState ('')

    // state modal
    const [showModalEvent, setShowModalEvent] = useState (false)
    const [showAlertHapus, setShowAlertHapus] = useState (false)

    const editModal = (selectedItem) => {
        setShowModalEvent (true)
        setAction ('update')
        setNama (selectedItem.nama)
        setId (selectedItem.id)
    }

    const getEvent = () => {
        axios.get (BASE_URL + `/api/event`)
        .then (res => {
            setEvent (res.data.data)
        })
        .catch (err => {
            console.log(err.response.data.message);
        })
    }

    const isLogged = () => {
        if (localStorage.getItem ('token') === null || localStorage.getItem ('admin') === null) {
            router.push ('/admin/login')
        }
    }

    useEffect (() => {
        getEvent ()
        isLogged ()
    }, [])

    return (
        <>
        <div className="flex ">

        {/* side bar */}
        <Sidebar />
        {/* Akhir sidebar */}

        {/* awal konten utama */}
        {/* supaya konten dan header dapat di scroll dan tidak memengaruhi sidebar */}
        <div className="w-full overflow-y-auto h-screen"> 
        
            {/* header */}
            <Navbar />
            {/* akhir header */}

            {/* konten utama */}
            <div className="bg-[#1E213C] text-white min-h-full">

            {/* wrapper */}
            <div className="p-7 space-y-5">
                {/* Input Data */}
                <div className="bg-[#2C2F48] rounded-lg flex justify-between p-3">
                    <div className="flex items-center px-2">
                    <span className='text-lg uppercase font-semibold'>Setting</span>
                    </div>
                    <div className="flex px-5 space-x-5">
                    {event.map((item, index) => (
                        <button className='bg-blue-700 px-3 py-2 rounded-lg' onClick={() => editModal(item)}>Edit Data</button>
                    ))}
                    </div>
                </div>

                {/* table */}
                <div className="bg-[#2C2F48] min-h-full rounded-lg">
                {/* Table */}
                <table className='w-full table-fixed'>
                <thead className='border-b-2'>
                    <tr>
                        <th>Nama Event</th>
                        <th>File</th>
                    </tr>
                </thead>
                    <tbody className='text-center'>
                    {event.map((item, index) => (
                    <tr className='even:bg-[#4C4F6D] odd:bg-[#2c2f48]'>
                      <td>{item.nama}</td>
                      <td className=''>
                        <div className='my-5'>
                            <h5 className='text-left'>File Logo</h5>
                            <img src={BASE_URL + "/api/event/image/" + item.logo} alt="logo" className='w-[25%]'></img>
                        </div>
                        <div className='my-5'>
                            <h5 className='text-left'>File Icon1</h5>
                            <img src={BASE_URL + "/api/event/image/" + item.icon1} alt="logo" className='w-[25%]'></img>
                        </div>
                        <div className='my-5'>
                            <h5 className='text-left'>File Icon2</h5>
                            <img src={BASE_URL + "/api/event/image/" + item.icon2} alt="logo" className='w-[25%]'></img>
                        </div>
                      </td>
                    </tr>
                  ))}
                    <tr></tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        <Footer />
        </div>
        {/* akhir konten utama */}
        </div>

        <globalState.Provider value={{ showModalEvent, setShowModalEvent, action, setAction, event, setEvent, nama, setNama, id, setId}}>
            <ModalEvent />
        </globalState.Provider>
        {/* <globalState.Provider value={{ showModalJuri, setShowModalJuri, action, setAction, namaJuri, setNamaJuri, nama, setNama, id, setId}}>
        <ModalJuri />
        </globalState.Provider> */}
        
        {/* <globalState.Provider value={{ showAlertHapus, setShowAlertHapus, setNamaJuri, id }}>
        <ModalDelete />
        </globalState.Provider> */}

    </>

    )
}

export default webSetting