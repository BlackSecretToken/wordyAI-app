from enum import Enum
 
class Gender(Enum):
    Mr = 1
    Mrs = 2
    Company = 3
    NONE = 4

class Role(Enum):
    User = 1
    Admin = 2

class Category(Enum):
    CSV = 1
    XML = 2
    SHOP = 3

class ESHOPTYPE(Enum):
    WOOCOMMERCE = 1
    MAGENTO2 = 2
    SHOPWARE6 = 3
    SHOPIFY = 4

class PRODUCTSTATUS(Enum):
    OPTIMIZED = 1
    UNOPTIMIZED = 2
    REJECTED = 3
    
class HELPAUDIENCE(Enum):
    DISLIKE = 0
    LIKE = 1

class BILLINGMETHOD(Enum):
    FREE = 0
    MEMBERSHIP = 1

class BILLINGSTATUS(Enum):
    CREATE = 0
    UPDATE = 1
    DELETE = 2
    
Role_User = 'User'
Role_Admin = 'Admin'
ProductStatus_Optimized = 'OPTIMIZED'
ProductStatus_Unoptimized = 'UNOPTIMIZED'
ProductStatus_Rejected = 'REJECTED'