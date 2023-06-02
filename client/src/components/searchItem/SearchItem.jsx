import "./searchItem.css";

const SearchItem = ({item,onClick}) => {

return (
    <div className="searchItem" onClick={onClick}>
      <img
        src={item.photo}
        className="siImg"
      />
      <div className="siDesc">
        <div className="siTitle">{item.name}</div>
        <div><strong>Email</strong> : {item.email}</div>
      </div>
    </div>
  );
};

export default SearchItem;
