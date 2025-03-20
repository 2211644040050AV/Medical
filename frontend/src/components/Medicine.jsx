import React from 'react';
import { Link } from 'react-router-dom';

export default function Medicine() {
  return (
    <>
      <div className="container-fluid vh-100 p-3 ">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1>Manage Products</h1>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
          <Link to="/add" className="btn btn-success">Add Medicine</Link>          </div>
        </div>

        <div className="row">
          <div className="col-md-12 table-responsive">
          <table className="table table-striped table-bordered mt-3">
              <thead className='table-dark text-center'>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Pr. Image</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className='text-center' scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td className='text-center'>@mdo</td>
                  <td className='text-center'>Mark</td>
                  <td className='text-center'>Otto</td>
                  <td className="d-flex align-items-center gap-2 justify-content-center">
                    <button className="btn btn-primary ">Update</button>
                    <button className="btn btn-danger ">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
