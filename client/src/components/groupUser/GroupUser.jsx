import "./GroupUser.css";

const GroupUser = ({item,onClick}) => {

return (
    <div className="GroupUser" onClick={onClick}>
        <span>{item.name.slice(0,5)}</span>
        <i class="fa fa-times" aria-hidden="true"></i>
    </div>
  );
};

export default GroupUser;
