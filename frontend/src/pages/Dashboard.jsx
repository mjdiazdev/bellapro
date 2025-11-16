import React, {useEffect, useState} from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';


export default function Dashboard(){
const [data, setData] = useState(null);


useEffect(()=>{
api.get('/dashboard-data')
.then(r=>setData(r.data))
.catch(()=>{});
},[]);


const logout = async () => {
await api.post('/logout');
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
}


const user = JSON.parse(localStorage.getItem('user') || 'null');


return (
<div className="d-flex">
<Sidebar />
<div className="p-4 w-100">
<div className="d-flex justify-content-between align-items-center mb-4">
<h3>Dashboard</h3>
<div>
<span className="me-3">{user?.name}</span>
<button className="btn btn-outline-secondary btn-sm" onClick={logout}>Cerrar sesión</button>
</div>
</div>


<div className="row">
<div className="col-md-4">
<div className="card p-3">
<h6>Usuarios</h6>
<div className="display-6">{data?.stats?.users ?? '—'}</div>
</div>
</div>
</div>


</div>
</div>
);
}