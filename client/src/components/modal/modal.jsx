import "./modal.css"

const Modal = ({item,setOpenModal}) => {
    
    return (
      <div className="modal">
        <div className="mContainer">
            <i class="fa fa-times" aria-hidden="true" onClick={()=>setOpenModal(false)}></i>
            <div className="mItem">
                {item.name}
                <hr />
            </div>
            <div className="mItem">
            <img src={item.photo || "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"} alt="" className="mImg"/>
            </div>
            <div className="mItem">
                Email:
                <div>{item.email}</div>
            </div>
        </div>
      </div>
    );
  };
  
  export default Modal;