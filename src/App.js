// To-Do list

import { useState } from "react";

// const initialItems = [
//     { id: 1, description: "Passports", quantity: 2, packed: false },
//     { id: 2, description: "Socks", quantity: 12, packed: true },
//   ];

  export default function App()
{
    // The state and handler function is used here. Is called as lifting state up- means if one state used for both compnents the state will be lift up.
    // This items state is taken into app component, this is state is used for both compnents(form, packinglist). 
    // if state is used in the app then easy to share the data. Use props to connect. 
    const [items, setItems]= useState([]);
    // const newItems= items.length;

    function handleAddItems(item){
        setItems((items) => [...items, item]); 
    }

    // Function for deleting the items - filter 
    function handleDeleteItem(id) {
        setItems((items) => items.filter((item) => item.id !==id))
    }
    
    function handleToggleItem(id) {
        setItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, packed: !item.packed } : item
    ));}
    
//**** */ The below two functions are same (this two functions will clear the list). But, first function will make sure that the user want to clear the list or not and another function will be directly clear the list. 
    
// function handleClearList(){
    //     const confirmed= window.confirm("Aree you sure you want to delete the items?");
    //     if(confirmed) setItems([]);
    // } 
    function handleClearList(){
        setItems([]);
    }

    return (
       <div className="app">
        <Logo/>
        <Form onAddItems={handleAddItems} />
        <PackingLists 
            items={items} 
            onDeleteItem= {handleDeleteItem}
            onToggleItem= {handleToggleItem}
            onClearList= {handleClearList}
        />
        <Stats items={items}/>
       </div>
    );
}


// logo, form, items, list, stats

function Logo() {
    return(
        <h1>FocusFlow</h1>
    );
}

// Buliding a form
function Form({onAddItems}) {
    const [description, setDescription] = useState("");
    // const [quantity, setQuantity] = useState(1);

    // To add the items into the packing list this state is used. 
    // const [items, setItems]= useState([]);

    // function handleAddItems(item){
    //     setItems((items) => [...items, items]); // immutability
    //     // setItems((items) => items.push(item)); mutable 
    // }
    
    // Not to re-load page- preventDefault() is used. 
    function handleSubmit(e){
        e.preventDefault();

        if (!description) return; 

        // const newItem = {description, quantity, packed:false, id:Date.now()};
        const newItem = {description, packed:false, id:Date.now()};
        // console.log(newItem); 
        
        // handleAddItems(newItem);
        onAddItems(newItem);

        // This will return the elements to there orginal prosition. Without a re-load.
        setDescription(""); 
        // setQuantity(1);
    }

    return(
        <form className="add-form" onSubmit={handleSubmit}>
            {/* <h3> What do you need? </h3> */}
            {/* normal way of selecting 
            <select>
                <option value={1}>1</option>
                <option value={2}>2</option>
            </select> */}
            {/* To change the string to integer- either use + or Number() */}
            {/* <select 
                value={quantity}
                onChange={(e) => {setQuantity(Number(e.target.value))}}>
            {/* `weight of the items. */}
                {/* {Array.from({length: 20},(_, i) => i+1).map(
                    (num)=>( 
                    <option value={num} key={num}>
                        {num}
                    </option>
                ))}
            </select> */} 
            <input type="text" 
                 placeholder="Enter task..." 
                 value={description} 
                //  e.target.value - 
                onChange={(e) => { setDescription(e.target.value)}} />
            <button>Add</button>
        </form>
    );
}

function PackingLists({items, onDeleteItem, onToggleItem, onClearList}) {
   const [sortBy, setSortBy]= useState("input"); 
    // For another copy of the list, the below variable is decleared and the reason is once the list is sorted then, the list can't be manipulated, becuase of this reason the variable is defined. 
   let sortedItems;
   
   if(sortBy === "input") sortedItems= items; 

   if(sortBy === "description") 
    sortedItems =items
    .slice()
    .sort((a,b) =>a.description.localeCompare(b.description))

    if(sortBy === "packed") 
    sortedItems =items
    .slice()
    .sort((a,b) =>Number(a.packed)- Number(b.packed))

    return (
        <div className="list">
            <ul> 
                {/* Rendering the items */}
                {/* {initialItems.map((item) => (
                    <Item item={item} key={item.id} />
                    ))} */}
                {/* The above function used for demo and below was used after creating the state in the App. Items - [](array of items) */}
                    {/* {items.map((item) => ( */}
                    {sortedItems.map((item) => (
                    <Item 
                        item={item} 
                        onDeleteItem={onDeleteItem} 
                        onToggleItem= {onToggleItem} 
                        key={item.id} />
                    ))}
            </ul>
            <div className="actions">
                <select value={sortBy} onChange={(e)=> setSortBy(e.target.value)}>
                    <option value="input"> sort by input order</option>
                    <option value="description"> sort by description</option>
                    <option value="packed"> sort by packed status</option>
                </select>
                <button onClick={onClearList}>Clear list</button>
            </div>
        </div>
    );
}

function Item({item, onDeleteItem, onToggleItem}) {
    return (
            <li>
                <input 
                type="checkbox"
                value={item.packed}
                onChange={() => onToggleItem(item.id)}
                />
                {/* If item is packed, the item will be strike else no */}
                <span style=
                    {item.packed 
                    ? {textDecoration:"line-through"}
                    : {}}>
                  {item.quantity} {item.description}
                </span>
                <button onClick={() => onDeleteItem(item.id)}>❌</button>
            </li>
        );
}

function Stats({items}) {

    if (!items.length)
        return (
        <p className="stats">
            <em>Start adding some items to your packing list 🚀</em>
        </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? `You got everything! Ready to go ✈️`
          : ` 💼 You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)`}
      </em>
    </footer>
  );

    // const numItems = items.length;
    // const numPacked = items.filter((item) => item.packed).length;
    // const percentage = Math.round((numPacked / numItems) * 100);

    // return(
    //     <footer className = "stats">
    //         <em>
    //         {`You got ${numItems} items on your list, and your already packed ${numPacked}(${percentage}X%)`}
    //         </em>
    //     </footer>
    // );
}

