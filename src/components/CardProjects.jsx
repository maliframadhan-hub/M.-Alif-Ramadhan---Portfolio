```jsx id="m7x0lh"
function CardProjects(props){

    return(

        <div className="card">

            <h3>
                {props.title}
            </h3>

            <p>
                {props.desc}
            </p>

            <button>
                Detail
            </button>

        </div>

    );

}

export default CardProjects;
```
