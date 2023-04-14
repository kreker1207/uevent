import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import api from '../utils/apiSetting'
import Pagination from 'react-js-pagination';
import { FaCalendar, FaEnvelope } from 'react-icons/fa';
import { IconContext } from 'react-icons';

export default function Companies() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState({data: [], pagination: {}, isLoading: true})

  useEffect(() => {
    api.get(`/orgs`)
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
    api.get(`/orgs/${page}`)
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
                <div className="img-block">
                  <div className="compnay-img">
                    <img src={`http://localhost:8080/organization_pics/${item.org_pic}`} alt="logo" />
                  </div>
                </div>
                <div className='company-content'>
                  <h2>{item.title}</h2>
                  <div className='description'>{item.description}</div>
                  <div className='additionals'>
                    <div>
                      <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                        <div>
                          <FaCalendar/> Events number: {item.num_events}
                        </div>
                      </IconContext.Provider>
                      <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: "5px" } }}>
                        <div className='location'>
                          <FaEnvelope /> {item.email}
                        </div>
                      </IconContext.Provider>
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
    max-width: fit-content;
    margin: 0 auto;
    padding: 0px 20px;
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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: auto;
    grid-gap: 10px;
    margin-bottom: 60px;

    .company {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      background: #333533;
      gap: 20px;
      padding: 25px;

      .img-block {
        width: 20%;
        .compnay-img {
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          border-radius: 65%;
          overflow: hidden;
          position: relative;

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: left top;
          }
        }
      }
      .company-content {
        width: 80%;
        display: flex;
        flex-direction: column;
        .description {
          margin: 20px 0;
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
        }
        .additionals {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          flex-wrap: wrap;
          gap: 10px;

          button {
            width: 150px;
            height: 40px;
            background: #FFD100;
            border: none;
            color: #fff;
          }
        }
      }
    }
  }
      /* Телефоны в портретной ориентации */
  @media only screen and (max-width: 320px) {
    .companies-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      .company {
        .img-block { 
          width: 40%;
        }
        .company-content {
          width: 60%;
        }
      }
    }
  }

  /* Телефоны в альбомной ориентации */
  @media only screen and (min-width: 321px) and (max-width: 568px) {
    .companies-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      .company {
        .img-block { 
          width: 40%;
        }
        .company-content {
          width: 60%;
        }
      }
    }
  }

  /* Планшеты в портретной ориентации */
  @media only screen and (min-width: 569px) and (max-width: 768px) {
    .companies-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      .company {
        .img-block { 
          width: 25%;
        }
        .company-content {
          width: 75%;
        }
      }
    }
  }

  /* Планшеты в альбомной ориентации */
  @media only screen and (min-width: 769px) and (max-width: 1024px) {
    .companies-list {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      .company {
        .img-block { 
          width: 15%;
        }
        .company-content {
          width: 85%;
        }
      }
    }
  }
`
