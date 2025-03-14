import bcrypt

def hash_password(plain_password):
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')


admin_password = "admin"  
hashed_password = hash_password(admin_password)

print("Hashed Password:", hashed_password)
