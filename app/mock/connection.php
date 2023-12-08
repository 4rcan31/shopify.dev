<?php 
class Connection{
    protected $connection = null;


    private $host  = '3.128.250.42';
    private $database = 'usuarios';
    private $user  = 'dummyjson';
    private $password  = '1234';
    private $port = '3307';


    public function __construct(){
        try{
            $link = new PDO(
                'mysql:host='.$this->host.';dbname='.$this->database.';port='.$this->port,
                $this->user, 
                $this->password
            );
            $link->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $link->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
            $link->exec('set names utf8');
            $this->connection = $link;
        }catch(Exception $e){
            throw new Exception($e->getMessage());
        }
    }

    public function connection(){
        return $this->connection;
    }
}