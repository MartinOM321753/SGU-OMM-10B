import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingIds, setDeletingIds] = useState(new Set())
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFetchingUser, setIsFetchingUser] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [editUserId, setEditUserId] = useState(null)
  const [editForm, setEditForm] = useState(() => ({
    name: '',
    lastname1: '',
    lastname2: '',
    email: '',
    phoneNumber: '',
  }))
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [createForm, setCreateForm] = useState(() => ({
    name: '',
    lastname1: '',
    lastname2: '',
    email: '',
    phoneNumber: '',
  }))

  // URL base para tu API
  const baseUrl = `https://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_BASE}`

  useEffect(() => {
    if (!baseUrl) {
      setError('La variable BASE_URL no está configurada.')
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    const loadUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${baseUrl}/users`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`La petición falló con estado ${response.status}`)
        }

        const data = await response.json()
        const parsedUsers = Array.isArray(data?.data) ? data.data : []
        setUsers(parsedUsers)
        if (!Array.isArray(data?.data) && !parsedUsers.length) {
          setError('Formato de respuesta inesperado.')
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudieron cargar los usuarios.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()

    return () => controller.abort()
  }, [baseUrl])

  useEffect(() => {
    if (!isEditModalOpen || !editUserId) return
    if (!baseUrl) {
      setError('La variable BASE_URL no está configurada.')
      return
    }

    const controller = new AbortController()
    const fetchUser = async () => {
      try {
        setIsFetchingUser(true)
        const response = await fetch(`${baseUrl}/users/${editUserId}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`La consulta del usuario falló con estado ${response.status}`)
        }

        const data = await response.json()
        const user = data?.data
        if (!user || typeof user !== 'object') {
          throw new Error('Formato de usuario inesperado.')
        }

        setEditForm({
          name: user.name ?? '',
          lastname1: user.lastname1 ?? '',
          lastname2: user.lastname2 ?? '',
          email: user.email ?? '',
          phoneNumber: user.phoneNumber ?? '',
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudieron cargar los datos del usuario.')
        }
      } finally {
        setIsFetchingUser(false)
      }
    }

    fetchUser()

    return () => controller.abort()
  }, [baseUrl, editUserId, isEditModalOpen])

  const handleDelete = async (userId) => {
    if (!baseUrl) {
      setError('La variable BASE_URL no está configurada.')
      return
    }

    setError(null)
    setDeletingIds((prev) => {
      const next = new Set(prev)
      next.add(userId)
      return next
    })

    try {
      const response = await fetch(`${baseUrl}/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`El borrado falló con estado ${response.status}`)
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el usuario.')
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  const handleOpenEdit = (userId) => {
    setError(null)
    setEditUserId(userId)
    setIsEditModalOpen(true)
  }

  const handleCloseEdit = () => {
    setIsEditModalOpen(false)
    setEditUserId(null)
    setEditForm({
      name: '',
      lastname1: '',
      lastname2: '',
      email: '',
      phoneNumber: '',
    })
    setIsFetchingUser(false)
    setIsUpdatingUser(false)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    if (!baseUrl || !editUserId) {
      setError('La variable BASE_URL no está configurada.')
      return
    }

    setIsUpdatingUser(true)
    try {
      const response = await fetch(`${baseUrl}/users/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          lastname1: editForm.lastname1,
          lastname2: editForm.lastname2,
          email: editForm.email,
          phoneNumber: editForm.phoneNumber || null,
        }),
      })

      if (!response.ok) {
        throw new Error(`La actualización falló con estado ${response.status}`)
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === editUserId
            ? {
                ...user,
                name: editForm.name,
                lastname1: editForm.lastname1,
                lastname2: editForm.lastname2,
                email: editForm.email,
                phoneNumber: editForm.phoneNumber || null,
              }
            : user
        )
      )
      handleCloseEdit()
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el usuario.')
    } finally {
      setIsUpdatingUser(false)
    }
  }

  const handleOpenCreate = () => {
    setError(null)
    setCreateForm({
      name: '',
      lastname1: '',
      lastname2: '',
      email: '',
      phoneNumber: '',
    })
    setIsCreateModalOpen(true)
  }

  const handleCloseCreate = () => {
    setIsCreateModalOpen(false)
    setIsCreatingUser(false)
  }

  const handleCreateChange = (event) => {
    const { name, value } = event.target
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    if (!baseUrl) {
      setError('La variable BASE_URL no está configurada.')
      return
    }

    setIsCreatingUser(true)
    try {
      const response = await fetch(`${baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name,
          lastname1: createForm.lastname1,
          lastname2: createForm.lastname2,
          email: createForm.email,
          phoneNumber: createForm.phoneNumber || null,
        }),
      })

      if (!response.ok) {
        throw new Error(`La creación falló con estado ${response.status}`)
      }

      const data = await response.json()
      const createdUser = data?.data
      if (createdUser && typeof createdUser === 'object') {
        setUsers((prev) => [...prev, createdUser])
      } else {
        // Por si la API no regresa el usuario creado, recargamos la lista
        try {
          const refreshResponse = await fetch(`${baseUrl}/users`)
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            const parsedUsers = Array.isArray(refreshData?.data)
              ? refreshData.data
              : []
            setUsers(parsedUsers)
          }
        } catch (refreshError) {
          setError(
            refreshError.message ||
              'Usuario creado, pero no se pudo refrescar la lista.'
          )
        }
      }

      handleCloseCreate()
    } catch (err) {
      setError(err.message || 'No se pudo crear el usuario.')
    } finally {
      setIsCreatingUser(false)
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <div className="app-header-text">
          <h1>Gestión de usuarios</h1>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          Agregar 
        </button>
      </header>

      <section className="app-content">
        {isLoading && <p className="status status-info">Cargando usuarios…</p>}
        {error && !isLoading && (
          <p className="status status-error">
            Error al cargar usuarios: {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="card">
            <div className="card-header">
              <h2>Listado de usuarios</h2>
             
            </div>

            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido paterno</th>
                    <th>Apellido materno</th>
                    <th>Correo electrónico</th>
                    <th>Teléfono</th>
                    <th className="col-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.lastname1}</td>
                        <td>{user.lastname2}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>
                          <div className="actions">
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => handleOpenEdit(user.id)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleDelete(user.id)}
                              disabled={deletingIds.has(user.id)}
                            >
                              {deletingIds.has(user.id)
                                ? 'Eliminando…'
                                : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {isCreateModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Registrar usuario</h2>
            <form onSubmit={handleCreateSubmit} className="modal-form">
              <label>
                Nombre
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  required
                />
              </label>

              <label>
                Apellido paterno
                <input
                  type="text"
                  name="lastname1"
                  value={createForm.lastname1}
                  onChange={handleCreateChange}
                  required
                />
              </label>

              <label>
                Apellido materno
                <input
                  type="text"
                  name="lastname2"
                  value={createForm.lastname2}
                  onChange={handleCreateChange}
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  required
                />
              </label>

              <label>
                Teléfono
                <input
                  type="tel"
                  name="phoneNumber"
                  value={createForm.phoneNumber}
                  onChange={handleCreateChange}
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCloseCreate}
                  disabled={isCreatingUser}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isCreatingUser}
                >
                  {isCreatingUser ? 'Creando…' : 'Guardar usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Editar usuario</h2>
            {isFetchingUser ? (
              <p className="status status-info">
                Cargando datos del usuario…
              </p>
            ) : (
              <form onSubmit={handleEditSubmit} className="modal-form">
                <label>
                  Nombre
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Apellido paterno
                  <input
                    type="text"
                    name="lastname1"
                    value={editForm.lastname1}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Apellido materno
                  <input
                    type="text"
                    name="lastname2"
                    value={editForm.lastname2}
                    onChange={handleEditChange}
                  />
                </label>

                <label>
                  Correo electrónico
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label>
                  Teléfono
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleEditChange}
                  />
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCloseEdit}
                    disabled={isUpdatingUser}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdatingUser}
                  >
                    {isUpdatingUser ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default App
