import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import api from '../utils/apiSetting'
import Pagination from 'react-js-pagination';

export default function Companies() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState({data: [], pagination: {}, isLoading: true})

  useEffect(() => {
    api.get(`/org`)
    .then(function(response) {
      console.log(response.data)
      setCompanies({
        data: response.data.data,
        pagination: response.data.pagination,
        isLoading: false
      })
    })
    .catch(function(error) {
        console.log(error.message)
    })
  }, [])

  const handleCreateCompany = () => {
    navigate('/create-company')
  }
  const handleCompanyClick = (id) => {
    navigate(`/companies/${id}`)
  }

  const handlePageChange = (page) => {
    api.get(`/companies/${page}`)
    .then(function(response) {
      console.log(response.data)
      setCompanies({
        isLoading: false,
        data: response.data.data,
        pagination: response.data.pagination
      })
    
    })
    .catch(function(error) {
        console.log(error.message)
    })
  }

  return (
    <Container>
      <div className="create-company">
        <h1>All Companies</h1>
        <button onClick={handleCreateCompany}>+ Create Company</button>
      </div>
      {
        companies.isLoading ? 
        <div className="loading">Loading...</div>
        :
        <div className="companies-list">
        {
          companies.data.map((item, index) => {
            return (
              <div className="company" key={index}>
                <div className="compnay-img">
                  <img src={`http://localhost:8080/organization_pics/${item.org_pic}`} alt="logo" />
                </div>
                <div className='company-content'>
                  <h2>{item.title}</h2>
                  <p className='description'>{item.description}</p>
                  <div className='additionals'>
                    <div>
                      <p>Events number: {item.evNumbers}</p>
                      <p>{item.location}</p>
                    </div>
                    <button onClick={() => handleCompanyClick(item.id)}>See More</button>
                  </div>
                </div>
              </div>
            )
          })
        }
        </div>
      }
      <Pagination className='pagination'
            activePage={Number(companies.pagination.currentPage)}
            itemsCountPerPage={companies.pagination.perPage}
            totalItemsCount={2}
            pageRangeDisplayed={5}
            onChange={handlePageChange} 
      />
    </Container>
  )
}

const Container = styled.div`
  max-width: 1480px;
  margin: 0 auto;
  padding: 0px 20px;
  .pagination {
    width: fit-content;
    margin: 0 auto;
    li {
      display: inline-block;
      width: 30px;
      height: 30px;
      text-align: center;
      &.active {
        background: #FFD100;
        a {
          color: white;
        }
      }
      &.disabled {
        a {
          color: #D9D9D9;
        }
      }
      a {
        text-decoration: none;
        color: #fff;
        font-weight: 700;
        display: block;
        padding-top: 2px;
        height: 30px;
      }
    }
  }
  .create-company {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    button {
      width: 152.21px;
      height: 40px;
      background-color: #FFD100;

      color: #fff;
      font-weight: 700;
      font-size: 16px;

      border: none;
      cursor: pointer;
    }
  }
  .companies-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    margin-bottom: 60px;
    .company {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: fit-content;
      padding: 25px;
      background-color: #333533;
      gap: 20px;
      .compnay-img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        overflow: hidden;
        img {
          height: 100%;
          object-fit: cover;
        }
      }
      .company-content {
        flex-grow: 1;
        height: fit-content;
        .description {
          margin: 0;
          -ms-text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          overflow: hidden;
          -ms-line-clamp: 3;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          display: -webkit-box;
          display: box;
          word-wrap: break-word;
          -webkit-box-orient: vertical;
          box-orient: vertical;

          color: #A6A6A6;
          margin-bottom: 10px;
        }
        .additionals {
          display: flex;
          justify-content: space-between;
          align-items: center;
          button {
            width: 152.21px;
            height: 40px;
            background-color: #FFD100;

            color: #fff;
            font-weight: 700;
            font-size: 16px;

            border: none;
            cursor: pointer;
          }
        }
      }
    }
  }
`
