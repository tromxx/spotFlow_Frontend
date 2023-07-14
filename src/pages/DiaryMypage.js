import React, { useState } from "react";
import { styled } from "styled-components";
import MyDiary from "../components/MyDiary";
import SearchBar from "../components/SearchBar/DiarySearchBar2";
import { BsPeople } from "react-icons/bs";
import avatar from "../images/default_avatar.png"
import { BsTrash } from "react-icons/bs";
import { BsListUl } from "react-icons/bs";
import { Navigate, useNavigate } from 'react-router-dom';
import DiaryApi from "../api/DiaryApi";
import { useEffect } from "react";
import axios from "axios";




const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: gray; */
    position: relative;
    top:70px;

    .namebar{
        display: flex;
        width: 70vw;
        height: 15vh;
        /* border: solid 5px red; */
        justify-content: center;
        align-items: center;
        justify-content: space-between;
        @media (max-width: 400px) {
            width: 90vw;
        }
        }
        .namebarleft{
            width: 75%;
            height: 60px;
            display: flex;
            justify-content: flex-start;
            align-items: end;
        }
        .namebarright{
            width: 25%;
            height: 60px;
            display: flex;
            justify-content: center;
            top:60px;
        }
        
        .menu{
            /* width: 75%; */
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
        }

        .id{
            display: flex;
            justify-content: center;
            align-items: center;
            h6{
                font-size: 13px;
                margin-left: 15px;
            }
        }

    .img{
        width: 70px;
        height: 70px;
   //     margin-right: 20px;
    }

    .searchBarline{
        display: flex;
        justify-content: space-between;
        align-items:center;
        width: 100%;
        height: 100%;
    }
    .cancle{
        border: solid 1px #00b4d8; 
        background-color: white;
        color: black;
        width: 70px;
        height: 40px;
        font-size: 1rem;
        border-radius: 10px;
        text-align: center;
        font-family: 'Black Han Sans', sans-serif;

        
        /* display: flex;
        justify-content: center;
        text-align: center; */
        }

        
    .list{
        /* margin: 80%; */
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: flex-end;
        &:hover{
            color: gray;
            font-weight: bold;
        }
        margin-right: 20px;
    }

    /* .people{
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
    }  */
    .trash{
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: flex-end;
        /* margin-right: 20px; */
    }
    /* .Search-bar {
        padding: 0;
        margin-left: 0;
    } */
    `;

const DiaryMypagediv = styled.div`
    width: 70vw;
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: beige; */
    margin-top: 20px;
    border: solid 3px black;
    border-radius: 20px;
    @media (max-width: 400px) {
        width: 90vw;
        border: solid 1px black;
    }


`;

    const DiaryMypage = () => {

    const navi = useNavigate();

    const [isCheckBox, setIsCheckBox] = useState(false);

    const [data,setData] = useState([]);

    const convertCheckBox = () => {
        if(isCheckBox === false) setIsCheckBox(true)
        else setIsCheckBox(false);
        console.log(isCheckBox);
    };
    
        const [item, setItem] = useState({
          id: 1,
          title: "삭제된 게시글입니다.",
          content:"삭제된 게시글입니다.",
          timeLineList: [
            { id: 2 },
            { id: 3 }
          ]
        });
        const handleDeleteItem = async () => {
            try {
              const response = await DiaryApi.delete('/api/items/' + item.id); // 백엔드 API 엔드포인트를 적절하게 수정하세요
              console.log('아이템 삭제 성공:', response.data);
              // 삭제 성공 후 필요한 동작 수행
            } catch (error) {
              console.error('아이템 삭제 실패:', error);
              // 삭제 실패 시 처리할 로직
            }
          };

          useEffect(() => {
            const fetchData = async () => {
                const email = "test@example.com";
                const res = await DiaryApi.findMyDiary(email);
                
                setData(res.data);
                
            };
            fetchData();
            
          }, []);  
        
          useEffect(() => {
            console.log(data);
        }, [data]);
      

    return(
        
        <Container>
             <header>
                <div className="namebar">
                    <div className="namebarleft">
                    <div className="id">
                        <img className="img" src={avatar} alt="" />
                        <h6>whddus425</h6>
                     </div>
                
                 </div>
                 <div className="namebarright">
                         {/* <div className="menu">
                                {isCheckBox ? (
                                    <>
                                        <button onClick={convertCheckBox}>취소</button>
                                        <button>삭제</button>
                                    </>)
                                : (
                                    <>
                                        <BsListUl onClick={()=>{navi("/diary")}} className="list"/>
                                        <BsTrash className="trash" onClick={convertCheckBox}/>
                                    </>)
                                }
                        </div> */}
                    </div>
                </div> 
                <div className="searchBarline">
                    <SearchBar/>
                    <div className="menu">
                                {isCheckBox ? (
                                    <>
                                        <button 
                                            className="cancle" 
                                            style={{marginRight: "10px"}}
                                            onClick={convertCheckBox}>Cancle</button>
                                        <button 
                                            onClick={handleDeleteItem}                                      
                                            className="cancle"
                                            style={{border:"solid 1px #f24e1e", color:"#f24e1e"}}
                                            >Delete</button>
                                    </>)
                                : (
                                    <>
                                        <BsListUl onClick={()=>{navi("/diary")}} className="list"/>
                                        <BsTrash className="trash" onClick={convertCheckBox}/>
                                    </>)
                                }
                        </div>
                 </div>   
            </header>
            <body>
        <DiaryMypagediv>
            <MyDiary stat={isCheckBox} data={data}/>
        </DiaryMypagediv>
        </body>
        </Container>
    );
};

export default DiaryMypage;