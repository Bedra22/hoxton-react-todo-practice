
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [todo, setTodos] = useState([])
  const [searching, setSearsearchinghTodo] = useState('')

  const filteredTodo = todo.filter(searchTodo => searchTodo.todo.toLowerCase().includes(searching))


  function toggle(id: number) {

    let copyOfTodos = structuredClone(todo)

    const findMatch = copyOfTodos.find(todos => todos.id === id)
    findMatch.completed = !findMatch.completed

    fetch(`http://localhost:3500/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(findMatch)
    })

    setTodos(copyOfTodos)
  }

  function deleteTodo(id: number) {

    let copyOfTodos = todo.filter(todos => todos.id !== id)

    fetch(`http://localhost:3500/todos/${id}`, {
      method: 'DELETE'
    })

    setTodos(copyOfTodos)
  }


  function addTodo(text: string) {
    let newtodo = {
      todo: text,
      completed: false
    }

    fetch(`http://localhost:3500/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newtodo)
    })
      .then(resp => resp.json())
      .then(NewTodoFromServer => setTodos([...todo, NewTodoFromServer]))
  }

  useEffect(() => {
    fetch('http://localhost:3500/todos')
      .then(resp => resp.json())
      .then(TodosFromServer => setTodos(TodosFromServer))
  }, [])

  return (
    <div className="App">
      <div className='todos'>
        <h1>YOUR TODOS</h1>
        <div className='search-todos'>
          <input
            type="text"
            name='text'
            placeholder='Search todo...'
            onChange={event => {
              setSearchTodo(event.target.value)
            }}

          />

        </div>
        <div>
          <ul>
            {
              filteredTodo.map(alltodos => (
                <li key={alltodos.id}  >
                  <span
                    className={alltodos.completed ? 'completed' : ''}
                    onClick={() => {
                      toggle(alltodos.id)
                    }}
                  >
                    {alltodos.todo}
                  </span>
                  <button
                    onClick={() => {
                      deleteTodo(alltodos.id)
                    }}
                  >🗑️</button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className='new-todo'>
          <h1>Add Todo</h1>
          <div className='add-new-todo'>
            <form
              onSubmit={event => {
                event.preventDefault()
                addTodo(event.target.new.value)
              }}
            >
              <input
                type="text"
                name='new'
                className='add-todo-input'
                placeholder='Add new todo here...' />
              <button>➕</button>
            </form>
          </div>


        </div>
      </div>
    </div >
  )
}

export default App
