import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import api from '../utils/apiSetting'

export default function Companies() {
  const [loading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Company Name',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nobis deleniti vitae commodi molestias magni aperiam eos, eligendi dolorem itaque hic odit rem neque amet voluptatem ut unde facilis omnis?',
      evNumbers: 34,
      adminEmail: 'example@gmail.com'
    },
    {
      id: 2,
      name: 'Company Name',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nobis deleniti vitae commodi molestias magni aperiam eos, eligendi dolorem itaque hic odit rem neque amet voluptatem ut unde facilis omnis?',
      evNumbers: 34,
      adminEmail: 'example@gmail.com'
    },
    {
      id: 3,
      name: 'Company Name',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nobis deleniti vitae commodi molestias magni aperiam eos, eligendi dolorem itaque hic odit rem neque amet voluptatem ut unde facilis omnis?',
      evNumbers: 34,
      adminEmail: 'example@gmail.com'
    },
    {
      id: 4,
      name: 'Company Name',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nobis deleniti vitae commodi molestias magni aperiam eos, eligendi dolorem itaque hic odit rem neque amet voluptatem ut unde facilis omnis?',
      evNumbers: 34,
      adminEmail: 'example@gmail.com'
    }
  ])

  useEffect(() => {
    // api.get(`/companies`)
    // .then(function(response) {
    //   setCompanies(response.data)
    //   setIsLoading(false)
    // })
    // .catch(function(error) {
    //     console.log(error.message)
    // })
  }, [])

  return (
    <Container>
      <div className="create-company">
        <h1>All Companies</h1>
        <button>+ Create Company</button>
      </div>
      {
        loading ? 
        <div className="loading">Loading...</div>
        :
        <div className="companies-list">
        {
          companies.map((item, index) => {
            return (
              <div className="company" key={index}>
                <div className="compnay-img">
                  <img src={require("../assets/company.jpg")} alt="logo" />
                </div>
                <div className='company-content'>
                  <h2>{item.name}</h2>
                  <p className='description'>{item.description}</p>
                  <div className='additionals'>
                    <div>
                      <p>Events number: {item.evNumbers}</p>
                      <p>{item.adminEmail}</p>
                    </div>
                    <button>See More</button>
                  </div>
                </div>
              </div>
            )
          })
        }
        </div>
      }
    </Container>
  )
}

const Container = styled.div`
  max-width: 1480px;
  margin: 0 auto;
  padding: 0px 20px;
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
    .company {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      height: 215px;
      padding: 25px;
      background-color: #333533;
      .compnay-img {
        width: 20%;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .company-content {
        width: 80%;
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
