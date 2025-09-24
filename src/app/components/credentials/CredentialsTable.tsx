'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Skeleton } from '../ui/skeleton'
import { Plus, Eye, EyeOff, Edit, Trash2, Globe, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Database } from '@/types/supabase'

type Credential = Database['public']['Tables']['credentials']['Row']
type CredentialInsert = Database['public']['Tables']['credentials']['Insert']
type CredentialUpdate = Database['public']['Tables']['credentials']['Update']

interface VisibilityState {
  [key: string]: boolean
}

export function CredentialsTable() {
  const { supabase, user } = useAuth()
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null)
  const [passwordVisibility, setPasswordVisibility] = useState<VisibilityState>({})
  const [formData, setFormData] = useState({
    title: '',
    website: '',
    username: '',
    password: '',
    notes: ''
  })

  const fetchCredentials = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching credentials:', error)
        toast.error('Failed to load credentials')
        return
      }

      setCredentials(data || [])
    } catch (error) {
      console.error('Error in fetchCredentials:', error)
      toast.error('An error occurred while loading credentials')
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase])

  // Fetch credentials on component mount
  useEffect(() => {
    if (user) {
      fetchCredentials()
    }
  }, [user, fetchCredentials])

  const resetForm = () => {
    setFormData({
      title: '',
      website: '',
      username: '',
      password: '',
      notes: ''
    })
  }

  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !formData.username || !formData.password) {
      toast.error('Username and password are required')
      return
    }

    try {
      const credentialData: CredentialInsert = {
        user_id: user.id,
        title: formData.title,
        website: formData.website,
        username: formData.username,
        password_hash: formData.password,
        notes: formData.notes
      }

      const { data, error } = await supabase
        .from('credentials')
        .insert([credentialData])
        .select()
        .single()

      if (error) {
        console.error('Error adding credential:', error)
        toast.error('Failed to add credential')
        return
      }

      setCredentials(prev => [data, ...prev])
      setIsAddDialogOpen(false)
      resetForm()
      toast.success('Credential added successfully')
    } catch (error) {
      console.error('Error in handleAddCredential:', error)
      toast.error('An error occurred while adding the credential')
    }
  }

  const handleEditCredential = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCredential || !formData.username || !formData.password) {
      toast.error('Username and password are required')
      return
    }

    try {
      const updateData: CredentialUpdate = {
        title: formData.title,
        website: formData.website,
        username: formData.username,
        password_hash: formData.password,
        notes: formData.notes
      }

      const { data, error } = await supabase
        .from('credentials')
        .update(updateData)
        .eq('id', editingCredential.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating credential:', error)
        toast.error('Failed to update credential')
        return
      }

      setCredentials(prev => 
        prev.map(cred => cred.id === data.id ? data : cred)
      )
      setIsEditDialogOpen(false)
      setEditingCredential(null)
      resetForm()
      toast.success('Credential updated successfully')
    } catch (error) {
      console.error('Error in handleEditCredential:', error)
      toast.error('An error occurred while updating the credential')
    }
  }

  const handleDeleteCredential = async (credentialId: string) => {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', credentialId)

      if (error) {
        console.error('Error deleting credential:', error)
        toast.error('Failed to delete credential')
        return
      }

      setCredentials(prev => prev.filter(cred => cred.id !== credentialId))
      toast.success('Credential deleted successfully')
    } catch (error) {
      console.error('Error in handleDeleteCredential:', error)
      toast.error('An error occurred while deleting the credential')
    }
  }

  const togglePasswordVisibility = (credentialId: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }))
  }

  const openEditDialog = (credential: Credential) => {
    setEditingCredential(credential)
    setFormData({
      title: credential.title,
      website: credential.website,
      username: credential.username,
      password: credential.password_hash,
      notes: credential.notes
    })
    setIsEditDialogOpen(true)
  }

  const maskPassword = (password: string) => {
    return '*'.repeat(Math.min(password.length, 12))
  }

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Credentials Manager</CardTitle>
            <CardDescription>
              Securely store and manage your login credentials
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleAddCredential}>
                <DialogHeader>
                  <DialogTitle>Add New Credential</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new credential. All fields marked with * are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="col-span-3"
                      placeholder="e.g., Gmail Account"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="col-span-3"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="col-span-3"
                      placeholder="Enter username or email"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="col-span-3"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="col-span-3"
                      placeholder="Additional notes (optional)"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Credential</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {credentials.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="text-muted-foreground">
              <Plus className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No credentials yet</p>
              <p className="text-sm">Add your first credential to get started</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title/Website</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {credential.title || 'Untitled'}
                        </div>
                        {credential.website && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Globe className="mr-1 h-3 w-3" />
                            <a 
                              href={credential.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline truncate max-w-[200px]"
                            >
                              {credential.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {credential.username}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {passwordVisibility[credential.id] 
                            ? credential.password_hash 
                            : maskPassword(credential.password_hash)
                          }
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(credential.id)}
                          className="h-8 w-8 p-0"
                        >
                          {passwordVisibility[credential.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(credential.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(credential)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Credential</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this credential? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCredential(credential.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleEditCredential}>
              <DialogHeader>
                <DialogTitle>Edit Credential</DialogTitle>
                <DialogDescription>
                  Update the details for this credential.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., Gmail Account"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-website" className="text-right">Website</Label>
                  <Input
                    id="edit-website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="col-span-3"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-username" className="text-right">Username *</Label>
                  <Input
                    id="edit-username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter username or email"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-password" className="text-right">Password *</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-notes" className="text-right">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="col-span-3"
                    placeholder="Additional notes (optional)"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingCredential(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Credential</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}