
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [todo, setTodos] = useState([])
  const [search, setSearchTodo] = useState('')



  function toggle(id: number) {

    let CopyOfTodos = structuredClone(todo)

    const FindMatch = CopyOfTodos.find(todos => todos.id === id)
    FindMatch.completed = !FindMatch.completed

    fetch(`http://localhost:3500/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(FindMatch)
    })

    setTodos(CopyOfTodos)
  }

  function Delete(id: number) {

    let CopyOfTodos = todo.filter(todos => todos.id !== id)

    fetch(`http://localhost:3500/todos/${id}`, {
      method: 'DELETE'
    })

    setTodos(CopyOfTodos)
  }

  function addtodo(text: string) {

    let NewTodo = {
      completed: false,
      todo: text
    }

    fetch('http://localhost:3500/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(NewTodo)
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

          />

        </div>
        <div>
          <ul>
            {
              todo.map(alltodos => (
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
                      Delete(alltodos.id)
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
                addtodo(event.target.new.value)
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
