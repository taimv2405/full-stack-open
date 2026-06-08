import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  removeBlog,
  addComment,
} from '../services/blogs';

const BLOGS_KEY = ['blogs'];

export const useBlogs = () => {
  const result = useQuery({
    queryKey: BLOGS_KEY,
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    blogs: result.data,
    isPending: result.isPending,
    isError: result.isError,
  };
};

export const useBlog = (id) => {
  const result = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => getBlog(id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    blog: result.data,
    isPending: result.isPending,
    isError: result.isError,
  };
};

export const useBlogMutations = () => {
  const queryClient = useQueryClient();

  const createBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (createdBlog) => {
      queryClient.setQueryData(BLOGS_KEY, (blogs = []) => [
        ...blogs,
        createdBlog,
      ]);
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(BLOGS_KEY, (blogs = []) =>
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
      );
      queryClient.setQueryData(['blogs', updatedBlog.id], updatedBlog);
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(BLOGS_KEY, (blogs = []) =>
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
      );
      queryClient.setQueryData(['blogs', updatedBlog.id], updatedBlog);
    },
  });

  const removeBlogMutation = useMutation({
    mutationFn: removeBlog,
    onSuccess: (_, id) => {
      queryClient.setQueryData(BLOGS_KEY, (blogs = []) =>
        blogs.filter((blog) => blog.id !== id),
      );
      queryClient.removeQueries({ queryKey: ['blogs', id] });
    },
  });

  return {
    createBlog: (blogInfo) => createBlogMutation.mutateAsync(blogInfo),
    addComment: (payload) => addCommentMutation.mutateAsync(payload),
    updateBlog: (updatePayload) =>
      updateBlogMutation.mutateAsync(updatePayload),
    removeBlog: (id) => removeBlogMutation.mutateAsync(id),
  };
};
