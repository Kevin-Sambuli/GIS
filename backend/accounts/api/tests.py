# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APITestCase
# from blog.models import Post, Category
# from django.contrib.auth.models import User
# from rest_framework.test import APIClient
#
#
# class PostTests(APITestCase):
#
#     def test_view_posts(self):
#         """
#         Ensure we can view all objects.
#         """
#         url = reverse('blog_api:listcreate')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_create_post(self):
#         """
#         Ensure we can create a new Post object and view object.
#         """
#         self.test_category = Category.objects.create(name='django')
#         self.testuser1 = User.objects.create_superuser(
#             username='test_user1', password='123456789')
#         # self.testuser1.is_staff = True
#
#         self.client.login(username=self.testuser1.username,
#                           password='123456789')
#
#         data = {"title": "new", "author": 1,
#                 "excerpt": "new", "content": "new"}
#         url = reverse('blog_api:listcreate')
#         response = self.client.post(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#
#     def test_post_update(self):
#
#         client = APIClient()
#
#         self.test_category = Category.objects.create(name='django')
#         self.testuser1 = User.objects.create_user(
#             username='test_user1', password='123456789')
#         self.testuser2 = User.objects.create_user(
#             username='test_user2', password='123456789')
#         test_post = Post.objects.create(
#             category_id=1, title='Post Title', excerpt='Post Excerpt', content='Post Content', slug='post-title', author_id=1, status='published')
#
#         client.login(username=self.testuser1.username,
#                      password='123456789')
#
#         url = reverse(('blog_api:detailcreate'), kwargs={'pk': 1})
#
#         response = client.put(
#             url, {
#                 "title": "New",
#                 "author": 1,
#                 "excerpt": "New",
#                 "content": "New",
#                 "status": "published"
#             }, format='json')
#         print(response.data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)


# import json
# from rest_framework import status
# from django.test import TestCase, Client
# from django.urls import reverse
# from ..models import Puppy
# from ..serializers import PuppySerializer


# initialize the APIClient app
# client = Client()


# class PuppyTest(TestCase):
#     """ Test module for Puppy model """
#
#     def setUp(self):
#         Puppy.objects.create(
#             name='Casper', age=3, breed='Bull Dog', color='Black')
#         Puppy.objects.create(
#             name='Muffin', age=1, breed='Gradane', color='Brown')
#
#     def test_puppy_breed(self):
#         puppy_casper = Puppy.objects.get(name='Casper')
#         puppy_muffin = Puppy.objects.get(name='Muffin')
#         self.assertEqual(
#             puppy_casper.get_breed(), "Casper belongs to Bull Dog breed.")
#         self.assertEqual(
#             puppy_muffin.get_breed(), "Muffin belongs to Gradane breed.")

# class GetAllPuppiesTest(TestCase):
#     """ Test module for GET all puppies API """
#
#     def setUp(self):
#         Puppy.objects.create(
#             name='Casper', age=3, breed='Bull Dog', color='Black')
#         Puppy.objects.create(
#             name='Muffin', age=1, breed='Gradane', color='Brown')
#         Puppy.objects.create(
#             name='Rambo', age=2, breed='Labrador', color='Black')
#         Puppy.objects.create(
#             name='Ricky', age=6, breed='Labrador', color='Brown')
#
#     def test_get_all_puppies(self):
#         # get API response
#         response = client.get(reverse('get_post_puppies'))
#         # get data from db
#         puppies = Puppy.objects.all()
#         serializer = PuppySerializer(puppies, many=True)
#         self.assertEqual(response.data, serializer.data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)


# class GetSinglePuppyTest(TestCase):
#     """ Test module for GET single puppy API """
#
#     def setUp(self):
#         self.casper = Puppy.objects.create(
#             name='Casper', age=3, breed='Bull Dog', color='Black')
#         self.muffin = Puppy.objects.create(
#             name='Muffin', age=1, breed='Gradane', color='Brown')
#         self.rambo = Puppy.objects.create(
#             name='Rambo', age=2, breed='Labrador', color='Black')
#         self.ricky = Puppy.objects.create(
#             name='Ricky', age=6, breed='Labrador', color='Brown')
#
#     def test_get_valid_single_puppy(self):
#         response = client.get(
#             reverse('get_delete_update_puppy', kwargs={'pk': self.rambo.pk}))
#         puppy = Puppy.objects.get(pk=self.rambo.pk)
#         serializer = PuppySerializer(puppy)
#         self.assertEqual(response.data, serializer.data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_get_invalid_single_puppy(self):
#         response = client.get(
#             reverse('get_delete_update_puppy', kwargs={'pk': 30}))
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

"""
class CreateNewPuppyTest(TestCase):
    # Test module for inserting a new puppy

    def setUp(self):
        self.valid_payload = {
            'name': 'Muffin',
            'age': 4,
            'breed': 'Pamerion',
            'color': 'White'
        }
        self.invalid_payload = {
            'name': '',
            'age': 4,
            'breed': 'Pamerion',
            'color': 'White'
        }

    def test_create_valid_puppy(self):
        response = client.post(
            reverse('get_post_puppies'),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_puppy(self):
        response = client.post(
            reverse('get_post_puppies'),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
 """

"""   
class UpdateSinglePuppyTest(TestCase):
   # Test module for updating an existing puppy record
    def setUp(self):
        self.casper = Puppy.objects.create(
            name='Casper', age=3, breed='Bull Dog', color='Black')
        self.muffin = Puppy.objects.create(
            name='Muffy', age=1, breed='Gradane', color='Brown')
        self.valid_payload = {
            'name': 'Muffy',
            'age': 2,
            'breed': 'Labrador',
            'color': 'Black'
        }
        self.invalid_payload = {
            'name': '',
            'age': 4,
            'breed': 'Pamerion',
            'color': 'White'
        }

    def test_valid_update_puppy(self):
        response = client.put(
            reverse('get_delete_update_puppy', kwargs={'pk': self.muffin.pk}),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_update_puppy(self):
        response = client.put(
            reverse('get_delete_update_puppy', kwargs={'pk': self.muffin.pk}),
            data=json.dumps(self.invalid_payload),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
 """


"""       
class DeleteSinglePuppyTest(TestCase):
    Test module for deleting an existing puppy record

    def setUp(self):
        self.casper = Puppy.objects.create(
            name='Casper', age=3, breed='Bull Dog', color='Black')
        self.muffin = Puppy.objects.create(
            name='Muffy', age=1, breed='Gradane', color='Brown')

    def test_valid_delete_puppy(self):
        response = client.delete(
            reverse('get_delete_update_puppy', kwargs={'pk': self.muffin.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_puppy(self):
        response = client.delete(
            reverse('get_delete_update_puppy', kwargs={'pk': 30}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

"""
